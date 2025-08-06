package expo.modules.actioncreatedocument

import android.app.Activity
import android.content.Context
import android.content.Intent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.core.errors.InvalidArgumentException
import expo.modules.interfaces.filesystem.Permission
import expo.modules.kotlin.exception.Exceptions
import java.io.File
import java.net.URLConnection
import androidx.core.net.toUri

class CreateDocumentModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
    private var pendingPromise: Promise? = null
    private var fileToSave: File? = null

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('CreateDocument')` in JavaScript.
        Name("CreateDocument")

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("save") { url: String?, params: Options, promise: Promise ->
            if (pendingPromise != null) {
                throw InProgressException()
            }

            try {
                fileToSave = getLocalFileFoUrl(url)
                val mimeType = params.mimeType
                    ?: URLConnection.guessContentTypeFromName(fileToSave!!.name)
                    ?: "*/*"
                val filename = params.filename ?: fileToSave!!.name
                val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = mimeType
                    putExtra(Intent.EXTRA_TITLE, filename)
                }
                pendingPromise = promise
                appContext.throwingActivity.startActivityForResult(intent, REQUEST_CODE)
            } catch (e: InvalidArgumentException) {
                throw InvalidArgsException(e.message, e)
            } catch (e: Exception) {
                throw FailedException("Failed to save the file: ${e.message}", e)
            }

        }

        OnActivityResult { _, (requestCode, resultCode, resultData) ->
            if (requestCode == REQUEST_CODE && pendingPromise != null) {
                val uri = resultData?.data
                if (resultCode != Activity.RESULT_OK) {
                    pendingPromise?.reject(CancelledException())
                    pendingPromise = null
                    return@OnActivityResult
                } else if (uri == null) {
                    pendingPromise?.reject(FailedException("Result data is null.", Exception()))
                    pendingPromise = null
                    return@OnActivityResult
                }
                try {
                    val inputStream = fileToSave!!.inputStream()
                    val outputStream = context.contentResolver.openOutputStream(uri)
                    inputStream.use { input ->
                        outputStream?.use { output ->
                            input.copyTo(output)
                        } ?: throw FailedException(
                            "Failed to open output stream for URI.",
                            Exception()
                        )
                    }
                    pendingPromise?.resolve(null)
                } catch (e: Exception) {
                    pendingPromise?.reject(FailedException("Failed to copy file: ${e.message}", e))
                }
                pendingPromise = null
                fileToSave = null
            }
        }
    }

    @Throws(InvalidArgumentException::class)
    private fun getLocalFileFoUrl(url: String?): File {
        if (url == null) {
            throw InvalidArgumentException("URL to save cannot be null.")
        }
        val uri = url.toUri()
        if ("file" != uri.scheme) {
            throw InvalidArgumentException("Only local file URLs are supported (expected scheme to be 'file', got '" + uri.scheme + "'.")
        }
        val path = uri.path
            ?: throw InvalidArgumentException("Path component of the URL to share cannot be null.")
        if (!isAllowedToRead(path)) {
            throw InvalidArgumentException("Not allowed to read file under given URL.")
        }
        return File(path)
    }

    private fun isAllowedToRead(url: String?): Boolean {
        val permissions = appContext.filePermission
        return permissions?.getPathPermissions(context, url)?.contains(Permission.READ)
            ?: false
    }

    companion object {
        private const val REQUEST_CODE = 1
    }
}
