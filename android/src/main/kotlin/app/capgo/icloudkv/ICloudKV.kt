package app.capgo.icloudkv

import android.app.backup.BackupManager
import android.content.Context
import android.content.SharedPreferences

/**
 * Strings kept in a dedicated SharedPreferences file. Android Auto Backup includes it by default,
 * so the values come back when the app is installed on a new device signed in to the same Google account.
 */
class ICloudKV(private val context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    fun get(key: String): String? = prefs.getString(key, null)

    fun set(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
        BackupManager.dataChanged(context.packageName)
    }

    fun remove(key: String) {
        prefs.edit().remove(key).apply()
        BackupManager.dataChanged(context.packageName)
    }

    fun getAll(): Map<String, String> = prefs.all.mapNotNull { (k, v) -> (v as? String)?.let { k to it } }.toMap()

    fun synchronize(): Boolean {
        val ok = prefs.edit().commit()
        BackupManager.dataChanged(context.packageName)
        return ok
    }

    fun getPluginVersion(): String = "native"

    companion object {
        const val FILE = "CapgoICloudKV"
    }
}
