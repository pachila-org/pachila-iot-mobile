package com.sitech.oncon.barcode.core;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Hashtable;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.LightingColorFilter;
import android.hardware.Camera;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.EncodeHintType;
import com.google.zxing.Result;
import com.google.zxing.client.result.ParsedResult;
import com.google.zxing.client.result.ResultParser;
import com.google.zxing.common.HybridBinarizer;
import com.sitech.oncon.barcode.R;
import com.sitech.oncon.barcode.camera.CameraManager;
import com.sitech.oncon.barcode.executor.ResultHandler;

public final class CodeScanActivity extends Activity implements
		SurfaceHolder.Callback {

	private static final String TAG = CodeScanActivity.class.getSimpleName();
	private CameraManager cameraManager;
	private CaptureActivityHandler handler;
	private ViewfinderView viewfinderView;
	private TextView statusView;
	private TextView common_title_TV_left;
	private Result lastResult;
	private boolean hasSurface;
	private IntentSource source;
	private Collection<BarcodeFormat> decodeFormats;
	private String characterSet;
	private InactivityTimer inactivityTimer;
	private LinearLayout from_gallery, light;
	private final int from_photo = 010;
	static final int PARSE_BARCODE_SUC = 3035;
	static final int PARSE_BARCODE_FAIL = 3036;
	String photoPath;
	ProgressDialog mProgress;
	boolean lightStatus = false;

	// Dialog dialog;

	enum IntentSource {

		ZXING_LINK, NONE

	}

	Handler barHandler = new Handler() {

		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case PARSE_BARCODE_SUC:
				// viewfinderView.setRun(false);
				showDialog((String) msg.obj);
				break;
			case PARSE_BARCODE_FAIL:
				// showDialog((String) msg.obj);
				if (mProgress != null && mProgress.isShowing()) {
					mProgress.dismiss();
				}
				new AlertDialog.Builder(CodeScanActivity.this)
						.setTitle("��ʾ")
						.setMessage("ɨ��ʧ�ܣ�")
						.setPositiveButton("ȷ��",
								new DialogInterface.OnClickListener() {

									@Override
									public void onClick(DialogInterface dialog,
											int which) {
										dialog.dismiss();
									}
								}).show();
				break;
			}
			super.handleMessage(msg);
		}

	};

	ViewfinderView getViewfinderView() {
		return viewfinderView;
	}

	public Handler getHandler() {
		return handler;
	}

	CameraManager getCameraManager() {
		return cameraManager;
	}

	@Override
	public void onCreate(Bundle icicle) {
		super.onCreate(icicle);

		// Window window = getWindow();
		// window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
		setContentView(R.layout.codescan);

		hasSurface = false;
		inactivityTimer = new InactivityTimer(this);

		cameraManager = new CameraManager(getApplication());

		viewfinderView = (ViewfinderView) findViewById(R.id.viewfinder_view);
		viewfinderView.setCameraManager(cameraManager);
		statusView = (TextView) findViewById(R.id.status_view);
		common_title_TV_left = (TextView) findViewById(R.id.common_title_TV_left);
		from_gallery = (LinearLayout) findViewById(R.id.from_gallery);
		light = (LinearLayout)findViewById(R.id.light);
		// title = (TitleView) findViewById(R.id.decode_title);
		// from_gallery = (Button) findViewById(R.id.from_gallery);
		// Ϊ����͵ײ���ť���Ӽ����¼�
		setListeners();
	}

	public void showDialog(final String msg) {
		if (mProgress != null && mProgress.isShowing()) {
			mProgress.dismiss();
		}
		Log.e(TAG, msg);
		Intent resultIntent = new Intent();
		resultIntent.putExtra("SCAN_RESULT", msg);
		setResult(RESULT_OK, resultIntent);
		finish();

		// if (msg.startsWith("http")) {
		// new AlertDialog.Builder(CaptureActivity.this)
		// .setTitle(getString(R.string.memo))
		// .setMessage(
		// String.format(
		// getString(R.string.barcode_tow_dimen_success),
		// msg))
		// .setPositiveButton(getString(R.string.confirm),
		// new DialogInterface.OnClickListener() {
		//
		// @Override
		// public void onClick(DialogInterface dialog,
		// int which) {
		// dialog.dismiss();
		// // String testUrl =
		// // "http://www.on-con.com/oncon/pages/download.jsp";
		// Intent intent = new Intent();
		// intent.setAction("android.intent.action.VIEW");
		// Uri content_url = Uri.parse(msg);
		// intent.setData(content_url);
		// startActivity(intent);
		// finish();
		// }
		// })
		// .setNegativeButton(getString(R.string.cancel),
		// new DialogInterface.OnClickListener() {
		//
		// @Override
		// public void onClick(DialogInterface dialog,
		// int which) {
		// dialog.dismiss();
		// if ((source == IntentSource.NONE || source ==
		// IntentSource.ZXING_LINK)
		// && lastResult != null) {
		// restartPreviewAfterDelay(0L);
		// }
		// }
		// }).show();
		// } else {
		// new AlertDialog.Builder(CaptureActivity.this)
		// .setTitle(getString(R.string.memo))
		// .setMessage(
		// String.format(
		// getString(R.string.barcode_one_dimen_success),
		// msg))
		// .setPositiveButton(getString(R.string.confirm),
		// new DialogInterface.OnClickListener() {
		//
		// @Override
		// public void onClick(DialogInterface dialog,
		// int which) {
		// dialog.dismiss();
		// // ��ȡ�������������
		// ClipboardManager cm = (ClipboardManager)
		// getSystemService(Context.CLIPBOARD_SERVICE);
		// // ���ı����ݸ��Ƶ�������
		// cm.setText(msg);
		// // ��ȡ����������
		// // cm.getText();
		//
		// }
		// })
		// .setNegativeButton(getString(R.string.cancel),
		// new DialogInterface.OnClickListener() {
		//
		// @Override
		// public void onClick(DialogInterface dialog,
		// int which) {
		// dialog.dismiss();
		// if ((source == IntentSource.NONE || source ==
		// IntentSource.ZXING_LINK)
		// && lastResult != null) {
		// restartPreviewAfterDelay(0L);
		// }
		// }
		// }).show();
		// }

	}

	public void setListeners() {
		common_title_TV_left.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				// CaptureActivity.this.finish();
				Log.e(TAG, "result:");
				Intent resultIntent = new Intent();
				resultIntent.putExtra("SCAN_RESULT", "");
				setResult(RESULT_CANCELED, resultIntent);
				finish();
			}
		});

		from_gallery.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				StringUtils.showPictures(CodeScanActivity.this, from_photo);
			}
		});
		light.setOnClickListener(new OnClickListener() {
			Camera camera = null;
			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				cameraManager.LightControl();
			}
		});
	}

	// public String parsLocalPic(String path) {
	// String parseOk = null;
	// try {
	// Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType,
	// String>();
	// hints.put(EncodeHintType.CHARACTER_SET, "UTF8");
	//
	// BitmapFactory.Options options = new BitmapFactory.Options();
	// options.inJustDecodeBounds = true; // �Ȼ�ȡԭ��С
	// Bitmap bitmap = BitmapFactory.decodeFile(path, options);
	// options.inJustDecodeBounds = false; // ��ȡ�µĴ�С
	// // ���ű�
	// int be = (int) (options.outHeight / (float) 200);
	// if (be <= 0)
	// be = 1;
	// options.inSampleSize = be;
	// bitmap = BitmapFactory.decodeFile(path, options);
	// int w = bitmap.getWidth();
	// int h = bitmap.getHeight();
	// System.out.println(w + "   " + h);
	// RGBLuminanceSource source = new RGBLuminanceSource(bitmap);
	// BinaryBitmap bitmap1 = new BinaryBitmap(new HybridBinarizer(source));
	// QRCodeReader reader2 = new QRCodeReader();
	// Result result;
	//
	// result = reader2.decode(bitmap1, hints);
	// android.util.Log.i("steven", "result:" + result);
	// parseOk = result.getText();
	// } catch (Exception e) {
	// Log.e(TAG, "parsLocalPic e:"+e);
	// parseOk = null;
	// }
	// return parseOk;
	// }

	public String parsLocalPic(Uri originalUri) {
		String parseOk = null;
		try {
			Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();
			hints.put(EncodeHintType.CHARACTER_SET, "UTF8");
		    InputStream input = this.getContentResolver().openInputStream(originalUri);
		    BitmapFactory.Options onlyBoundsOptions = new BitmapFactory.Options();
		    onlyBoundsOptions.inJustDecodeBounds = true;
		    onlyBoundsOptions.inDither=true;//optional
		    onlyBoundsOptions.inPreferredConfig=Bitmap.Config.ARGB_8888;//optional
		    BitmapFactory.decodeStream(input, null, onlyBoundsOptions);
		    input.close();
		    if ((onlyBoundsOptions.outWidth == -1) || (onlyBoundsOptions.outHeight == -1))
		        return null;
		    BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
		    bitmapOptions.inSampleSize = 2;
		    bitmapOptions.inDither=true;//optional
		    bitmapOptions.inPreferredConfig=Bitmap.Config.ARGB_8888;//optional
		    input = this.getContentResolver().openInputStream(originalUri);
		    Bitmap bitmap = BitmapFactory.decodeStream(input, null, bitmapOptions);
		    input.close();

//			BitmapFactory.Options options = new BitmapFactory.Options();
//			options.inJustDecodeBounds = true; // �Ȼ�ȡԭ��С
			// Bitmap bitmap = BitmapFactory.decodeFile(path, options);
//			Bitmap bitmap = MediaStore.Images.Media.getBitmap(
//					getContentResolver(), originalUri);
			
//			options.inJustDecodeBounds = false; // ��ȡ�µĴ�С
			// ���ű�
//			int be = (int) (options.outHeight / (float) 200);
//			if (be <= 0)
//				be = 1;
//			options.inSampleSize = be;
			// bitmap = BitmapFactory.decodeFile(path, options);
//			bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(),
//					originalUri);
			int w = bitmap.getWidth();
			int h = bitmap.getHeight();
			Log.e("----------->", w + "   " + h);
			RGBLuminanceSource source = new RGBLuminanceSource(bitmap);
			BinaryBitmap bitmap1 = new BinaryBitmap(new HybridBinarizer(source));
			QRCodeReader reader2 = new QRCodeReader();
			Result result;

			result = reader2.decode(bitmap1, hints);
			android.util.Log.i("steven", "result:" + result);
			parseOk = result.getText();
		} catch (Exception e) {
			Log.e(TAG, "parsLocalPic e:" + e);
			parseOk = null;
		}
		return parseOk;
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode,
			final Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		android.util.Log.i("steven", "data.getData()" + data);
		if (data != null) {
			mProgress = new ProgressDialog(CodeScanActivity.this);
			mProgress.setMessage("����ɨ��...");
			mProgress.setCancelable(false);
			mProgress.show();
			// final ContentResolver resolver = getContentResolver();
			if (requestCode == from_photo) {
				if (resultCode == RESULT_OK) {
					// Cursor cursor =
					// getContentResolver().query(data.getData(),
					// null, null, null, null);
					// if (cursor != null && cursor.moveToFirst()) {
					// photoPath = cursor.getString(cursor
					// .getColumnIndex(MediaStore.Images.Media.DATA));
					// Log.e(TAG, "photoPath:"+photoPath);
					// cursor.close();
					// }
					final Uri originalUri = data.getData();
					new Thread(new Runnable() {
						@Override
						public void run() {
							Looper.prepare();
							// String result = parsLocalPic(photoPath);
							String result = parsLocalPic(originalUri);
							if (result != null) {
								Message m = Message.obtain();
								m.what = PARSE_BARCODE_SUC;
								m.obj = result;
								barHandler.sendMessage(m);
							} else {
								Message m = Message.obtain();
								m.what = PARSE_BARCODE_FAIL;
								m.obj = "ɨ��ʧ�ܣ�";
								barHandler.sendMessage(m);
							}
							Looper.loop();
						}
					}).start();
				}

			}
		}
	}

	@Override
	protected void onResume() {
		super.onResume();
		handler = null;
		lastResult = null;
		resetStatusView();
		SurfaceView surfaceView = (SurfaceView) findViewById(R.id.preview_view);
		SurfaceHolder surfaceHolder = surfaceView.getHolder();
		if (hasSurface) {
			initCamera(surfaceHolder);
		} else {
			surfaceHolder.addCallback(this);
			surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		}
		inactivityTimer.onResume();
		source = IntentSource.NONE;
		decodeFormats = null;
	}

	@Override
	protected void onPause() {
		if (handler != null) {
			handler.quitSynchronously();
			handler = null;
		}
		inactivityTimer.onPause();
		cameraManager.closeDriver();
		if (!hasSurface) {
			SurfaceView surfaceView = (SurfaceView) findViewById(R.id.preview_view);
			SurfaceHolder surfaceHolder = surfaceView.getHolder();
			surfaceHolder.removeCallback(this);
		}
		super.onPause();
	}

	@Override
	protected void onDestroy() {
		inactivityTimer.shutdown();
		if (mProgress != null) {
			mProgress.dismiss();
		}
		super.onDestroy();
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		switch (keyCode) {
		case KeyEvent.KEYCODE_BACK:
			if ((source == IntentSource.NONE || source == IntentSource.ZXING_LINK)
					&& lastResult != null) {
				restartPreviewAfterDelay(0L);
				return true;
			}
			Log.e(TAG, "result:");
			Intent resultIntent = new Intent();
			resultIntent.putExtra("SCAN_RESULT", "");
			setResult(RESULT_CANCELED, resultIntent);
			finish();
			break;
		case KeyEvent.KEYCODE_VOLUME_DOWN:
			cameraManager.setTorch(false);
			return true;
		case KeyEvent.KEYCODE_VOLUME_UP:
			cameraManager.setTorch(true);
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

	// �����ʼ�����棬���ó�ʼ�����
	@Override
	public void surfaceCreated(SurfaceHolder holder) {
		if (holder == null) {
			Log.e(TAG,
					"*** WARNING *** surfaceCreated() gave us a null surface!");
		}
		if (!hasSurface) {
			hasSurface = true;
			initCamera(holder);
		}
	}

	@Override
	public void surfaceDestroyed(SurfaceHolder holder) {
		hasSurface = false;
	}

	@Override
	public void surfaceChanged(SurfaceHolder holder, int format, int width,
			int height) {

	}

	private static ParsedResult parseResult(Result rawResult) {
		return ResultParser.parseResult(rawResult);
	}

	// ������ά��
	public void handleDecode(Result rawResult, Bitmap barcode) {
		inactivityTimer.onActivity();
		lastResult = rawResult;

		ResultHandler resultHandler = new ResultHandler(parseResult(rawResult));

		boolean fromLiveScan = barcode != null;
		if (barcode == null) {
			android.util.Log.i("steven",
					"rawResult.getBarcodeFormat().toString():"
							+ rawResult.getBarcodeFormat().toString());
			android.util.Log.i("steven", "resultHandler.getType().toString():"
					+ resultHandler.getType().toString());
			android.util.Log.i("steven", "resultHandler.getDisplayContents():"
					+ resultHandler.getDisplayContents());
		} else {
			showDialog(resultHandler.getDisplayContents().toString());
		}
	}

	// ��ʼ���������CaptureActivityHandler����
	private void initCamera(SurfaceHolder surfaceHolder) {
		if (surfaceHolder == null) {
			throw new IllegalStateException("No SurfaceHolder provided");
		}
		if (cameraManager.isOpen()) {
			Log.w(TAG,
					"initCamera() while already open -- late SurfaceView callback?");
			return;
		}
		try {
			cameraManager.openDriver(surfaceHolder);
			if (handler == null) {
				handler = new CaptureActivityHandler(this, decodeFormats,
						characterSet, cameraManager);
			}
		} catch (IOException ioe) {
			Log.w(TAG, ioe);
			displayFrameworkBugMessageAndExit();
		} catch (RuntimeException e) {
			Log.w(TAG, "Unexpected error initializing camera", e);
			displayFrameworkBugMessageAndExit();
		}
	}

	private void displayFrameworkBugMessageAndExit() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle(getString(R.string.app_name));
		builder.setMessage(getString(R.string.msg_camera_framework_bug));
		builder.setPositiveButton(R.string.confirm, new FinishListener(this));
		builder.setOnCancelListener(new FinishListener(this));
		builder.show();
	}

	public void restartPreviewAfterDelay(long delayMS) {
		if (handler != null) {
			handler.sendEmptyMessageDelayed(Const.restart_preview, delayMS);
		}
		resetStatusView();
	}

	private void resetStatusView() {
		statusView.setText(R.string.msg_default_status);
		statusView.setVisibility(View.GONE);
		viewfinderView.setVisibility(View.VISIBLE);
		lastResult = null;
	}

	public void drawViewfinder() {
		viewfinderView.drawViewfinder();
	}

}