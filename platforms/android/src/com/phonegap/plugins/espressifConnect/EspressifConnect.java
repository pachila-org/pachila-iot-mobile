package com.phonegap.plugins.espressifConnect;

import java.util.Date;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.espressif.iot.esptouch.EsptouchTask;
import com.espressif.iot.esptouch.IEsptouchResult;
import com.espressif.iot.esptouch.help.EspWifiAdminSimple;
import com.sina.weibo.sdk.constant.WBConstants.Msg;

import android.R.bool;
import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.PixelFormat;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class EspressifConnect extends CordovaPlugin {

	private static final String MAC = "mac";
	CallbackContext cbc;
	Context ctx;
	EsptouchTask myTask;
	EspWifiAdminSimple wifiAdmin;

	ConnectThread ct;

	@SuppressLint("HandlerLeak")
	class ConnectThread extends Thread {
		public Handler mHandler;

		public void run() {
			Looper.prepare();
			mHandler = new Handler() {

				@Override
				public void handleMessage(Message msg) {
					// TODO Auto-generated method stub
					super.handleMessage(msg);

					Log.i("SICON", "before handleMessage");

					if (msg.what == 0x123) {
						String ss = msg.getData().getString("SS");
						String ps = msg.getData().getString("PS");

						Log.i("SICON", "ss is:" + ss + ", ps is:" + ps);

						wifiAdmin = new EspWifiAdminSimple(ctx);
						String bssid = wifiAdmin.getWifiConnectedBssid();

						myTask = new EsptouchTask(ss, bssid, ps, false, ctx);
						try {
							IEsptouchResult result = myTask.executeForResult();
							String strMac = result.getBssid();
							Log.i("SICON", "Mac is: " + strMac);
							//
							JSONObject obj = new JSONObject();
							try {
								obj.put(MAC, strMac);
							} catch (JSONException e) {

							}
							cbc.success(obj);

						} catch (Exception e) {
							cbc.success(e.getMessage());
							Log.i("SICON", e.getMessage());
						}
					}

					Log.i("SICON", "End Handler message...");

				}

			};
			Looper.loop();
		}

	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("getssid")) {
			callbackContext.success(getSSid());
			return true;
		} else if (action.equals("push2dvc")) {
			Log.i("SICON", "in side push 2 dvc");
			Push2Dvc(args, callbackContext);
			return true;
		} else if (action.equals("push2dvc-sync")) {
			Log.i("SICON", "in side syncpush2dvc");
			return Push2DvcSync(args, callbackContext);
			// return true;
		}

		return false;
	}

	// 异步连接
	private boolean Push2DvcSync(JSONArray args, CallbackContext callbackContext) throws JSONException {
		// TODO Auto-generated method stub
		Log.i("SICON", "begin to Push2DvcSync");
		// ct = new ConnectThread();
		// ct.start();
		//
		// cbc = callbackContext;
		// ctx = this.cordova.getActivity().getApplicationContext();
		//
		// Message message = new Message();
		// message.what = 0x123;
		// Bundle bundle = new Bundle();
		// bundle.putString("SS", args.getString(0));
		// bundle.putString("PS", args.getString(1));
		// message.setData(bundle);
		// ct.mHandler.sendMessage(message);
		Log.i("SICON", "after sendMessage - Push2DvcSync");
		return true;
	}

	private void Push2Dvc(JSONArray args, CallbackContext callbackContext) throws JSONException {

		Date dtStart = new Date();

		cbc = callbackContext;

		String ss = args.getString(0);
		String ps = args.getString(1);
		Context ctx = this.cordova.getActivity().getApplicationContext();
		// try ESP first, because it is more quickly

		wifiAdmin = new EspWifiAdminSimple(ctx);
		String bssid = wifiAdmin.getWifiConnectedBssid();

		myTask = new EsptouchTask(ss, bssid, ps, false, ctx);

		Log.i("SICON", "ss:" + ss + ",ps:" + ps + ",bssid:" + bssid);
		try {
			IEsptouchResult result = myTask.executeForResult();

			Date dtEnd = new Date();
			long iSecond = (dtEnd.getTime() - dtStart.getTime()) / 1000;
			String strMac = result.getBssid();

			Log.i("SICON", "Mac is: " + strMac);

			//
			JSONObject obj = new JSONObject();
			try {
				obj.put(MAC, strMac);
			} catch (JSONException e) {

			}
			cbc.success(obj);

		} catch (Exception e) {
			cbc.success(e.getMessage());
			Log.i("SICON", e.getMessage());
		}

	}

	private String getSSid() {
		Context ctx = this.cordova.getActivity().getApplicationContext();

		WifiManager wm = (WifiManager) ctx.getSystemService(Context.WIFI_SERVICE);
		if (wm != null) {
			WifiInfo wi = wm.getConnectionInfo();
			if (wi != null) {
				String s = wi.getSSID();
				if (s.length() > 2 && s.charAt(0) == '"' && s.charAt(s.length() - 1) == '"') {
					return s.substring(1, s.length() - 1);
				} else {
					return s;
				}
			}
		}
		return "";
	}
}
