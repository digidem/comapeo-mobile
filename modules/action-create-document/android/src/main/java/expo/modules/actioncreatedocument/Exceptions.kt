package expo.modules.actioncreatedocument

import expo.modules.kotlin.exception.CodedException

internal class InProgressException :
    CodedException("Another share request is being processed now.")

internal class FailedException(message: String, e: Exception) :
    CodedException(message, e.cause)

internal class InvalidArgsException(message: String?, e: Exception) :
    CodedException(message, e.cause)

internal class CancelledException :
    CodedException("The request was cancelled by the user or the system.")