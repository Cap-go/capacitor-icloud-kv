package app.capgo.icloudkv

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONObject

@CapacitorPlugin(name = "ICloudKV")
class ICloudKVPlugin : Plugin() {

    private lateinit var implementation: ICloudKV

    override fun load() {
        implementation = ICloudKV(context)
    }

    @PluginMethod
    fun get(call: PluginCall) {
        val key = call.getString("key") ?: return call.reject("key is required")
        val ret = JSObject()
        ret.put("value", implementation.get(key) ?: JSONObject.NULL)
        call.resolve(ret)
    }

    @PluginMethod
    fun set(call: PluginCall) {
        val key = call.getString("key")
        val value = call.getString("value")
        if (key == null || value == null) return call.reject("key and value are required")
        implementation.set(key, value)
        call.resolve()
    }

    @PluginMethod
    fun remove(call: PluginCall) {
        val key = call.getString("key") ?: return call.reject("key is required")
        implementation.remove(key)
        call.resolve()
    }

    @PluginMethod
    fun getAll(call: PluginCall) {
        val values = JSObject()
        implementation.getAll().forEach { (k, v) -> values.put(k, v) }
        call.resolve(JSObject().put("values", values))
    }

    @PluginMethod
    fun synchronize(call: PluginCall) {
        call.resolve(JSObject().put("synchronized", implementation.synchronize()))
    }

    @PluginMethod
    fun isAvailable(call: PluginCall) {
        call.resolve(JSObject().put("available", true).put("backend", "google-backup"))
    }

    @PluginMethod
    fun getPluginVersion(call: PluginCall) {
        call.resolve(JSObject().put("version", implementation.getPluginVersion()))
    }
}
