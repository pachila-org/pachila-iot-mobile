package com.phonegap.plugins.codescan;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

public class CodeScan extends CordovaPlugin {
	private String TAG = "====CodeScan====";
	private CallbackContext callbackContext;
	public static final int REQUEST_CODE = 111;
	private static final String SCAN_INTENT = "com.phonegap.plugins.codescan.CodeScan";
	private static final String TEXT = "text";
	private static final String CANCELLED = "cancelled";
    private static final String FORMAT = "format";

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
		if (action.equals("codeScan")) {
			codeScan();
			return true;
		}
		return false;
	}

	private void codeScan() {
		// Intent intent = new Intent(cordova.getActivity(),
		// com.sitech.oncon.barcode.core.CodeScanActivity.class);
		// this.cordova.startActivityForResult(this, intent, REQUEST_CODE);

		Intent intentScan = new Intent(SCAN_INTENT);
		intentScan.addCategory(Intent.CATEGORY_DEFAULT);
		intentScan.setPackage(this.cordova.getActivity()
				.getApplicationContext().getPackageName());
		this.cordova.startActivityForResult((CordovaPlugin) this, intentScan,
				REQUEST_CODE);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, intent.getStringExtra("SCAN_RESULT"));
                    obj.put(FORMAT, intent.getStringExtra("SCAN_RESULT_FORMAT"));
                    obj.put(CANCELLED, false);
                } catch (JSONException e) {
                    Log.d(TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, "");
                    obj.put(FORMAT, "");
                    obj.put(CANCELLED, true);
                } catch (JSONException e) {
                    Log.d(TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else {
                //this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
                this.callbackContext.error("Unexpected error");
            }
        }
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
	}

}