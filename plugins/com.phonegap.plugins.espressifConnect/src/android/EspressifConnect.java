package com.phonegap.plugins.espressifConnect;

import java.util.Date;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import com.espressif.iot.esptouch.EsptouchTask;
import com.espressif.iot.esptouch.IEsptouchResult;
import com.espressif.iot.esptouch.help.EspWifiAdminSimple;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class EspressifConnect extends CordovaPlugin {

	private static final String MAC = "mac";
	CallbackContext cbc;
	EsptouchTask myTask;
	EspWifiAdminSimple wifiAdmin;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getssid")) {
        	callbackContext.success(getSSid());
            return true;
        }
        if (action.equals("push2dvc")) {
          Log.i("SICON", "in side push 2 dvc");
        	Push2Dvc(args,callbackContext);
            return true;
        }

        return false;
    }

    private void Push2Dvc(JSONArray args,CallbackContext callbackContext) throws JSONException {

    	Date dtStart = new Date();

    	cbc = callbackContext;

    	String ss = args.getString(0);
    	String ps = args.getString(1);
    	Context ctx = this.cordova.getActivity().getApplicationContext();
    	//try ESP first, because it is more quickly

    	wifiAdmin = new EspWifiAdminSimple(ctx);
    	String bssid = wifiAdmin.getWifiConnectedBssid();

    	myTask = new EsptouchTask(ss, bssid, ps, false, ctx);
    	try
    	{
    		IEsptouchResult result = myTask.executeForResult();

			Date dtEnd = new Date();
        	long iSecond = (dtEnd.getTime() - dtStart.getTime()) / 1000;
        	String strMac = result.getBssid();

        	//here add connect success message and try the method to get MAC address
        	//String espmsg = strMac + " spend " + iSecond + " seconds";
    		//cbc.success(espmsg);

    		//
			JSONObject obj = new JSONObject();
			try {
                obj.put(MAC, strMac);
            } catch (JSONException e) {

            }
			cbc.success(obj);

    	}
    	catch(Exception e )
    	{
    		cbc.success(e.getMessage());
    	}


	}

	private String getSSid(){
    	Context ctx = this.cordova.getActivity().getApplicationContext();

		WifiManager  wm=(WifiManager)ctx.getSystemService(Context.WIFI_SERVICE);
		if(wm != null){
			WifiInfo wi = wm.getConnectionInfo();
			if(wi != null){
				String s = wi.getSSID();
				if(s.length()>2&&s.charAt(0) == '"'&&s.charAt(s.length() -1) == '"'){
					return s.substring(1,s.length()-1);
				}else{
					return s;
				}
			}
		}
		return "";
	}
}
