package com.comapeo

import android.content.Context
import android.net.ConnectivityManager
import android.net.LinkProperties
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.WifiManager
import android.net.wifi.WifiInfo
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class WifiModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context = reactContext.applicationContext
    private val connectivityManager =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    private val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as? WifiManager

    private val networkCallback =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            object : ConnectivityManager.NetworkCallback(FLAG_INCLUDE_LOCATION_INFO) {
                override fun onAvailable(network: Network) {
                    emit(network)
                }

                override fun onLost(network: Network) {
                    emit(null)
                }

                override fun onCapabilitiesChanged(
                    network: Network,
                    networkCapabilities: NetworkCapabilities
                ) {
                    emit(network, networkCapabilities = networkCapabilities)
                }

                override fun onLinkPropertiesChanged(
                    network: Network,
                    linkProperties: LinkProperties
                ) {
                    emit(network, linkProperties = linkProperties)
                }
            }
        } else {
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    emit(network)
                }

                override fun onLost(network: Network) {
                    emit(null)
                }

                override fun onCapabilitiesChanged(
                    network: Network,
                    networkCapabilities: NetworkCapabilities
                ) {
                    emit(network, networkCapabilities = networkCapabilities)
                }

                override fun onLinkPropertiesChanged(
                    network: Network,
                    linkProperties: LinkProperties
                ) {
                    emit(network, linkProperties = linkProperties)
                }
            }
        }

    private var numberOfListeners = 0

    override fun getName() = "WifiModule"

    @ReactMethod
    fun addListener(eventName: String) {
        if (numberOfListeners == 0) {
            startListening()
        }
        numberOfListeners++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        numberOfListeners -= count
        if (numberOfListeners == 0) {
            stopListening()
        }
    }

    private fun startListening() {
        val request = NetworkRequest.Builder()
            .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
            .build()
        connectivityManager.registerNetworkCallback(request, networkCallback)
    }

    private fun stopListening() {
        connectivityManager.unregisterNetworkCallback(networkCallback)
    }

    private fun getState(
        network: Network?,
        networkCapabilities: NetworkCapabilities?,
        linkProperties: LinkProperties?
    ): WritableMap {
        val result = Arguments.createMap()
        result.putString("ssid", getSsid(network, networkCapabilities))
        result.putString("ipAddress", getIpAddress(network, linkProperties))
        return result
    }

    private fun emit(
        network: Network?,
        networkCapabilities: NetworkCapabilities? = null,
        linkProperties: LinkProperties? = null
    ) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("change", getState(network, networkCapabilities, linkProperties))
    }

    private fun getSsid(network: Network?, networkCapabilities: NetworkCapabilities?): String? {
        val capabilities: NetworkCapabilities? = networkCapabilities
            ?: try {
                connectivityManager.getNetworkCapabilities(network)
            } catch (_: SecurityException) {
                // Old Android versions can throw errors here. See
                // <https://android.googlesource.com/platform/frameworks/base/+/249be21013e389837f5b2beb7d36890b25ecfaaf%5E%21/>.
                null
            }
        val wifiInfoFromCapabilities = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            capabilities?.transportInfo as? WifiInfo
        } else {
            null
        }
        // We use the deprecated `WifiManager#connectionInfo` here. Not ideal, but it is required
        // on older Android versions.
        return getSsid(wifiInfoFromCapabilities) ?: getSsid(wifiManager?.connectionInfo)
    }

    private fun getSsid(wifiInfo: WifiInfo?): String? {
        var result = wifiInfo?.ssid ?: return null

        // "If the SSID can be decoded as UTF-8, it will be returned surrounded by
        // double quotation marks. Otherwise, it is returned as a string of hex
        // digits. [...] Prior to `Build.VERSION_CODES.JELLY_BEAN_MR1`, this method
        // always returned the SSID with no quotes around it."
        // <https://developer.android.com/reference/android/net/wifi/WifiInfo#getSSID()>
        if (result.startsWith('"') && result.endsWith('"')) {
            result = result.substring(1, result.length - 1)
        }

        // "The SSID may be `WifiManager#UNKNOWN_SSID`, if there is no network
        // currently connected or if the caller has insufficient permissions to
        // access the SSID."
        if (result == WifiManager.UNKNOWN_SSID) {
            return null
        }

        return result
    }

    private fun getIpAddress(network: Network?, linkProperties: LinkProperties?): String? {
        val properties: LinkProperties? = linkProperties
            ?: try {
                connectivityManager.getLinkProperties(network)
            } catch (_: SecurityException) {
                // See SecurityException catch above for an explanation.
                null
            }

        return properties
            ?.linkAddresses
            ?.firstOrNull { !it.address.isLoopbackAddress }
            ?.toString()
    }
}
