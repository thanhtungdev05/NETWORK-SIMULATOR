<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>
<html><head>
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
	var virstrtmp = top.ary_strings;
	var vir_obj = {};
	for(var i=0; virstrtmp[i][0] != "";i++)
		vir_obj[virstrtmp[i][0]]=virstrtmp[i][1];
</script>
</head>
<script language="JavaScript">
	function saveLog()
	{
		var log='/message_syslog_sort.log';
		var code = 'location.assign("' + log + '")';
		eval(code);
	}
</script>
<body>
<FORM>
<div style="background-color: #FFFFFF;width:680px;padding:0px 3px 10px 3px;margin:0;outline:0;position:relative;border:1px solid #fff;">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr height="25px" style="width:100%;background:#e6e6e6;">
<td align=left style="width:250px;padding-left:20px;font-family: 'BeVietnamBold',Be Vietnam;font-size:15px;white-space:nowrap;text-align:left;color: #4acbd6;"><script>document.writeln(vir_obj["SystemLogText"]);</script></td>
</tr>
</table>
<tr>
<td class="light-orange"></td><td colspan="3" class="tabdata">&nbsp;</td></tr><tr>
<td class="light-orange">&nbsp;</td><td colspan="3" class="tabdata">
<TEXTAREA NAME="AlphaLogDisplay" ROWS="25" COLS="80" WRAP="ON" EDIT="OFF" style="font-family:'BeVietnamRegular',Be Vietnam;font-size: 12px;color: #404040;" READONLY>
[Thu Jan  1 11:15:36 1970][DNS][INFO]query[A] gum.criteo.com from 192.168.1.2
[Thu Jan  1 11:15:37 1970][DNS][INFO]query[A] server.playdigo.com from 192.168.1.2
[Thu Jan  1 11:15:37 1970][DNS][INFO]query[A] targeting.unrulymedia.com from 192.168.1.2
[Thu Jan  1 11:15:37 1970][DNS][INFO]query[A] api.w.inmobi.com from 192.168.1.2
[Thu Jan  1 11:15:37 1970][DNS][INFO]query[A] htlb.casalemedia.com from 192.168.1.2
[Thu Jan  1 11:15:38 1970][DNS][INFO]query[A] hbopenbid.pubmatic.com from 192.168.1.2
[Thu Jan  1 11:15:38 1970][DNS][INFO]query[A] cm.g.doubleclick.net from 192.168.1.2
[Thu Jan  1 11:15:38 1970][DNS][INFO]query[A] bc833562331f886d6dbc1200e3ffb82d.safeframe.googlesyndication.com from 192.168.1.2
[Thu Jan  1 11:15:39 1970][DNS][INFO]query[A] octopus-stream01-cads.fpt.vn from 192.168.1.2
[Thu Jan  1 11:15:39 1970][DNS][INFO]query[A] googleads.g.doubleclick.net from 192.168.1.2
[Thu Jan  1 11:15:41 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:15:43 1970][DNS][INFO]query[A] um.simpli.fi from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] cs.playdigo.com from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] gum.criteo.com from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] sync.inmobi.com from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] logperf.vnexpress.net from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] s.amazon-adsystem.com from 192.168.1.2
[Thu Jan  1 11:15:44 1970][DNS][INFO]query[A] match.adsrvr.org from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] inmobi-match.dotomi.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] match.deepintent.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] b1sync.outbrain.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ib.adnxs.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] id.rlcdn.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync.pinklion.io from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync.1rx.io from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] pixel.tapad.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] t.adx.opera.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ap.lijit.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] s.ad.smaato.net from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] match.prod.bidr.io from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] bh.contextweb.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] cs.admanmedia.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] creativecdn.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] cm.anyrtb.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] idsync.rlcdn.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] aa.agkn.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ittpx.eskimi.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] syncingbridge.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] us.ck-ie.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] tr.blismedia.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] measureadv.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ps.eyeota.net from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] csync.loopme.me from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] gw-iad-bid.ymmobi.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] tracker-shr.ortb.net from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync.srv.stackadapt.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] image4.pubmatic.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ads.stickyadstv.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] match.sharethrough.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] visitor-playdigoinc.omnitagjs.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] onetag-sys.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] www.temu.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] secure.adnxs.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync.targeting.unrulymedia.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync.ipredictive.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] sync-tb.yrxtam.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] x.bidswitch.net from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ad.turn.com from 192.168.1.2
[Thu Jan  1 11:15:45 1970][DNS][INFO]query[A] ssp-sync.criteo.com from 192.168.1.2
[Thu Jan  1 11:15:46 1970][DNS][INFO]query[A] token.rubiconproject.com from 192.168.1.2
[Thu Jan  1 11:15:46 1970][DNS][INFO]query[A] t.oa.opera.com from 192.168.1.2
[Thu Jan  1 11:15:49 1970][DNS][INFO]query[A] skydrive.wns.windows.com from 192.168.1.2
[Thu Jan  1 11:15:51 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:01 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:09 1970][DNS][INFO]query[A] variations.brave.com from 192.168.1.2
[Thu Jan  1 11:16:09 1970][DNS][INFO]query[A] go-updater.brave.com from 192.168.1.2
[Thu Jan  1 11:16:09 1970][DNS][INFO]query[A] default.exp-tas.com from 192.168.1.2
[Thu Jan  1 11:16:11 1970][DNS][INFO]query[A] clientservices.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:11 1970][DNS][INFO]query[A] daily-cloudcode-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:11 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:12 1970][DNS][INFO]query[A] play.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:12 1970][DNS][INFO]query[A] rr4---sn-42u-nbozd.googlevideo.com from 192.168.1.2
[Thu Jan  1 11:16:12 1970][DNS][INFO]query[A] discordapp.com from 192.168.1.2
[Thu Jan  1 11:16:13 1970][DNS][INFO]query[A] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:13 1970][DNS][INFO]query[A] self.events.data.microsoft.com from 192.168.1.2
[Thu Jan  1 11:16:13 1970][DNS][INFO]query[A] lh3.googleusercontent.com from 192.168.1.2
[Thu Jan  1 11:16:14 1970][DNS][INFO]query[A] clients4.google.com from 192.168.1.2
[Thu Jan  1 11:16:15 1970][DNS][INFO]query[A] accounts.google.com from 192.168.1.2
[Thu Jan  1 11:16:17 1970][DNS][INFO]query[A] settings-win.data.microsoft.com from 192.168.1.2
[Thu Jan  1 11:16:21 1970][DNS][INFO]query[A] www.apple.com from 192.168.1.2
[Thu Jan  1 11:16:23 1970][DNS][INFO]query[A] passwordsleakcheck-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:24 1970][DNS][INFO]query[A] beacons.gcp.gvt2.com from 192.168.1.2
[Thu Jan  1 11:16:25 1970][DNS][INFO]query[AAAA] play.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:25 1970][DNS][INFO]query[A] play.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:25 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:30 1970][DNS][INFO]query[A] github.com from 192.168.1.2
[Thu Jan  1 11:16:35 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:36 1970][DNS][INFO]query[A] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:36 1970][DNS][INFO]query[AAAA] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:36 1970][DNS][INFO]query[A] lmstudio.ai from 192.168.1.2
[Thu Jan  1 11:16:39 1970][DNS][INFO]query[A] www.google.com.vn from 192.168.1.2
[Thu Jan  1 11:16:42 1970][DNS][INFO]query[A] drivefrontend-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:45 1970][DNS][INFO]query[A] www.youtube.com from 192.168.1.2
[Thu Jan  1 11:16:45 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:16:46 1970][DNS][INFO]query[A] content-autofill.googleapis.com from 192.168.1.2
[Thu Jan  1 11:16:49 1970][DNS][INFO]query[A] accounts.youtube.com from 192.168.1.2
[Thu Jan  1 11:16:50 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:16:55 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:05 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:08 1970][DNS][INFO]query[A] claude.ai from 192.168.1.2
[Thu Jan  1 11:17:15 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:17 1970][DNS][INFO]query[A] accounts.google.com from 192.168.1.2
[Thu Jan  1 11:17:25 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:35 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:45 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:17:55 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:18:09 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:18:12 1970][DNS][INFO]query[A] ssl.gstatic.com from 192.168.1.2
[Thu Jan  1 11:18:19 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:18:26 1970][DNS][INFO]query[A] beacons.gcp.gvt2.com from 192.168.1.2
[Thu Jan  1 11:18:28 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:18:29 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:18:39 1970][DNS][INFO]query[A] api.anthropic.com from 192.168.1.2
[Thu Jan  1 11:18:39 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:18:41 1970][DNS][INFO]query[A] http-intake.logs.us5.datadoghq.com from 192.168.1.2
[Thu Jan  1 11:18:48 1970][DNS][INFO]query[A] www.google.com from 192.168.1.2
[Thu Jan  1 11:18:50 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:00 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:05 1970][DNS][INFO]query[A] catalog.gamepass.com from 192.168.1.2
[Thu Jan  1 11:19:10 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:20 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:22 1970][DNS][INFO]query[A] ecs.office.com from 192.168.1.2
[Thu Jan  1 11:19:30 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:32 1970][DNS][INFO]query[A] github.com from 192.168.1.2
[Thu Jan  1 11:19:38 1970][DNS][INFO]query[A] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:19:38 1970][DNS][INFO]query[A] time.windows.com from 192.168.1.2
[Thu Jan  1 11:19:40 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:19:44 1970][DNS][INFO]query[AAAA] drivefrontend-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:19:44 1970][DNS][INFO]query[A] drivefrontend-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:19:48 1970][DNS][INFO]query[A] www.google.com from 192.168.1.2
[Thu Jan  1 11:19:54 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:04 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:14 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:24 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:29 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:20:34 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:39 1970][DNS][INFO]query[A] api.anthropic.com from 192.168.1.2
[Thu Jan  1 11:20:44 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:20:54 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:04 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:11 1970][DNS][INFO]query[A] daily-cloudcode-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:21:13 1970][DNS][INFO]query[A] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:21:13 1970][DNS][INFO]query[A] lh3.googleusercontent.com from 192.168.1.2
[Thu Jan  1 11:21:14 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:18 1970][DNS][INFO]query[A] v10.events.data.microsoft.com from 192.168.1.2
[Thu Jan  1 11:21:18 1970][DNS][INFO]query[A] discordapp.com from 192.168.1.2
[Thu Jan  1 11:21:22 1970][DNS][INFO]query[A] www.apple.com from 192.168.1.2
[Thu Jan  1 11:21:24 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:30 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:21:36 1970][DNS][INFO]query[A] lmstudio.ai from 192.168.1.2
[Thu Jan  1 11:21:38 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:48 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:21:50 1970][DNS][INFO]query[A] www.google.com from 192.168.1.2
[Thu Jan  1 11:21:58 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:08 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:18 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:25 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:22:29 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:34 1970][DNS][INFO]query[A] github.com from 192.168.1.2
[Thu Jan  1 11:22:39 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:39 1970][DNS][INFO]query[AAAA] www.googleapis.com from 192.168.1.2
[Thu Jan  1 11:22:46 1970][DNS][INFO]query[A] drivefrontend-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:22:49 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:22:54 1970][DNS][INFO]query[A] ogads-pa.clients6.google.com from 192.168.1.2
[Thu Jan  1 11:22:55 1970][DNS][INFO]query[A] play.google.com from 192.168.1.2
[Thu Jan  1 11:22:56 1970][DNS][INFO]query[A] fonts.googleapis.com from 192.168.1.2
[Thu Jan  1 11:22:56 1970][DNS][INFO]query[A] fonts.gstatic.com from 192.168.1.2
[Thu Jan  1 11:22:59 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:09 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:12 1970][DNS][INFO]query[A] ssl.gstatic.com from 192.168.1.2
[Thu Jan  1 11:23:13 1970][DNS][INFO]query[A] play.google.com from 192.168.1.2
[Thu Jan  1 11:23:15 1970][DNS][INFO]query[A] gemini.google.com from 192.168.1.2
[Thu Jan  1 11:23:23 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:26 1970][DNS][INFO]query[A] api.anthropic.com from 192.168.1.2
[Thu Jan  1 11:23:29 1970][DNS][INFO]query[A] http-intake.logs.us5.datadoghq.com from 192.168.1.2
[Thu Jan  1 11:23:32 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:23:33 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:36 1970][DNS][INFO]query[A] fptsoftware362-my.sharepoint.com from 192.168.1.2
[Thu Jan  1 11:23:43 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:47 1970][DNS][INFO]query[AAAA] signaler-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:23:47 1970][DNS][INFO]query[A] signaler-pa.googleapis.com from 192.168.1.2
[Thu Jan  1 11:23:51 1970][DNS][INFO]query[A] www.google.com from 192.168.1.2
[Thu Jan  1 11:23:53 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:23:57 1970][DNS][INFO]query[A] google.com from 192.168.1.2
[Thu Jan  1 11:24:03 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:24:05 1970][DNS][INFO]query[A] catalog.gamepass.com from 192.168.1.2
[Thu Jan  1 11:24:13 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:24:19 1970][DNS][INFO]query[A] 197338-ipv4v6fdse.gr.global.aa-rt.sharepoint.com from 192.168.1.2
[Thu Jan  1 11:24:23 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:24:33 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:24:43 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:24:53 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:25:01 1970][DNS][INFO]query[A] accounts.google.com from 192.168.1.2
[Thu Jan  1 11:25:01 1970][DNS][INFO]query[A] browser-intake-us5-datadoghq.com from 192.168.1.2
[Thu Jan  1 11:25:03 1970][DNS][INFO]query[A] login.live.com from 192.168.1.2
[Thu Jan  1 11:25:03 1970][DNS][INFO]query[A] login.microsoftonline.com from 192.168.1.2
[Thu Jan  1 11:25:03 1970][DNS][INFO]query[A] www.bing.com from 192.168.1.2
[Thu Jan  1 11:25:04 1970][DNS][INFO]query[A] substrate.office.com from 192.168.1.2
[Thu Jan  1 11:25:07 1970][PPPoE][INFO]send PADI
[Thu Jan  1 11:25:17 1970][PPPoE][INFO]send PADI
</TEXTAREA>
</td></tr><tr><td class="light-orange"></td>
<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>
</div>
<div style="background-color: #FFFFFF;width:680px;padding:0px 3px 10px 3px;margin:0;outline:0;position:relative;border:1px solid #fff;"><table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr>
<td width="220"class="orange" height="42">&nbsp;</td><td width="390" class="orange">&nbsp;
<INPUT Name="bt_refresh" type="button" class="button1" value="Refresh" onClick="javascript:window.location='/cgi-bin/status_log.cgi'">&nbsp;&nbsp;<input type="button" class="button1" value="Save" onClick="saveLog();">
</td></tr></table></div></form>
</body></html>
