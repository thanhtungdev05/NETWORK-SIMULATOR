# Danh sách chụp HAR — Vigor2927

Nguồn: `spec/menu-tree.json` (dựng bằng cách thực thi thật JS của `menu.htm`).

**Đã đủ: 153/153 mục hiển thị đều có bằng chứng gốc.**

---

## 1. Dashboard — 1 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Dashboard | 1 | `/cgi-bin/cgidashboard.cgi?fid=1` | `doc/dashboard.htm` |

## 2. Wizards — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Quick Start Wizard | — | `/doc/wizmw.htm` | `doc/wizmw.htm` |
| [x] | Service Activation Wizard | 0 | `/cgi-bin/wizanti.cgi?fid=0` | `doc/constructerr.htm` |
| [x] | VPN Client Wizard | 0 | `/cgi-bin/vpn.cgi?fid=0` | `doc/vpnclwiz1.htm` |
| [x] | VPN Server Wizard | 3 | `/cgi-bin/vpn.cgi?fid=3` | `doc/vpnsvwiz1.htm` |

## 3. Online Status — 2 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Physical Connection | 168 | `/cgi-bin/v2x00.cgi?fid=168&option=1` | `doc/online1.sht` |
| [x] | Virtual WAN | 169 | `/cgi-bin/v2x00.cgi?fid=169` | `doc/online2.sht` |

## 4. WAN — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | General Setup | 100 | `/cgi-bin/wan.cgi?fid=100` | `doc/mwangen1.htm` |
| [x] | Internet Access | 104 | `/cgi-bin/wan.cgi?fid=104` | `doc/mwaninet1.htm` |
| [x] | Multi-VLAN | 2560 | `/cgi-bin/v2x00.cgi?fid=2560` | `doc/mpvcvlan1.HTM` |
| [x] | WAN Budget | 107 | `/cgi-bin/wan.cgi?fid=107&showdetail=0` | `doc/wanbudget.htm` |

## 5. LAN — 6 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | General Setup | 2001 | `/cgi-bin/v2x00.cgi?fid=2001` | `doc/enet1.htm` |
| [x] | VLAN | 2059 | `/cgi-bin/v2x00.cgi?fid=2059` | `doc/vlansetup.htm` |
| [x] | Bind IP to MAC | 2090 | `/cgi-bin/v2x00.cgi?fid=2090` | `doc/ipbmac.htm` |
| [x] | LAN Port Mirror | 2113 | `/cgi-bin/v2x00.cgi?fid=2113` | `doc/lanmirr.htm` |
| [x] | Wired 802.1X | 2888 | `/cgi-bin/v2x00.cgi?fid=2888` | `doc/lanwired802.htm` |
| [x] | Link Aggregation | 2901 | `/cgi-bin/v2x00.cgi?fid=2901&opmode=0` | `doc/lanAggregation.htm` |

## 6. Hotspot Web Portal — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Profile Setup | 0 | `/cgi-bin/hotspot.cgi?fid=0` | `doc/hsportal1.htm` |
| [x] | Users Information | 10 | `/cgi-bin/hotspot.cgi?fid=10` | `doc/hsuserstatus.htm` |
| [x] | Quota Management | 2 | `/cgi-bin/hotspot.cgi?fid=2&iAct=0` | `doc/hsquota1.htm` |
| [x] | PIN Generator | 3 | `/cgi-bin/hotspot.cgi?fid=3&iAct=0` | `doc/hspingeneate.htm` |

## 7. Routing — 3 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Static Route | 2053 | `/cgi-bin/v2x00.cgi?fid=2053` | `doc/ipstatrt.sht` |
| [x] | Load-Balance/Route Policy | 2087 | `/cgi-bin/v2x00.cgi?fid=2087&iPRToPage=1` | `doc/policyrt1.htm` |
| [x] | BGP | 4060 | `/cgi-bin/v2x00.cgi?fid=4060` | `doc/bgp.sht` |

## 8. NAT — 6 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Port Redirection | 0 | `/cgi-bin/ipnat.cgi?fid=0&iPageIdx=1` | `doc/ipnatp1.htm` |
| [x] | DMZ Host | 2 | `/cgi-bin/v2x00.cgi?fid=2&iAct=0&iInetWanIdx=1&iPageIdx=1&isTrueIpDmz=0` | `doc/MNatDmz.htm` |
| [x] | Open Ports | 2054 | `/cgi-bin/v2x00.cgi?fid=2054&iPageIdx=1` | `doc/mnatop.htm` |
| [x] | Port Triggering | 88 | `/cgi-bin/v2x00.cgi?fid=88&iAct=0` | `doc/mnatptrg1.htm` |
| [x] | Port Knocking | 0 | `/cgi-bin/ptknock.cgi?fid=0&iPageIdx=1` | `doc/ptknock.htm` |
| [x] | ALG | 87 | `/cgi-bin/v2x00.cgi?fid=87&iAct=0` | `doc/mnatalg.htm` |

## 9. Hardware Acceleration — 1 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Hardware Acceleration | 20 | `/cgi-bin/ipnat.cgi?fid=20&iAct=0` | `doc/hwaccelerset.htm` |

## 10. Firewall — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | General Setup | — | `/cgi-bin/ipf1.cgi` | `doc/ipfbas.sht` |
| [x] | Filter Setup | — | `/cgi-bin/ipf.cgi` | `doc/ipf.sht` |
| [x] | Defense Setup | 2005 | `/cgi-bin/v2x00.cgi?fid=2005` | `doc/dos.htm` |
| [x] | Diagnose | 2440 | `/cgi-bin/v2x00.cgi?fid=2440` | `doc/fwdiagnose.htm` |

## 11. User Management — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | General Setup | 0 | `/cgi-bin/fwuser.cgi?fid=0&iAct=0` | `doc/usergenset.htm` |
| [x] | User Profile | 1 | `/cgi-bin/fwuser.cgi?fid=1&iAct=0&iPageIdx=1` | `doc/userprof1.htm` |
| [x] | User Group | 2 | `/cgi-bin/fwuser.cgi?fid=2&iAct=0&iPageIdx=1` | `doc/usergrp1.htm` |
| [x] | User Online Status | 3 | `/cgi-bin/fwuser.cgi?fid=3&iUserStauts=1&iPageIdx=1` | `doc/userstatus.htm` |

## 12. Objects Setting — 12 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | IP Object | — | `/cgi-bin/ipobj.cgi?sIpObjAct=showpage&iIpObjPnum=1` | `doc/ipobj1.htm` |
| [x] | IP Group | — | `/cgi-bin/ipgrp.cgi?sIpGrpAct=showpage&iIpGrpPnum=1` | `doc/ipgrp1.htm` |
| [x] | Service Type Object | — | `/cgi-bin/stobj.cgi?sStObjAct=showpage&iStObjPnum=1` | `doc/stobj1.htm` |
| [x] | Service Type Group | — | `/cgi-bin/stgrp.cgi?sStGrpAct=showpage&iStGrpPnum=1` | `doc/stgrp1.htm` |
| [x] | Keyword Object | — | `/cgi-bin/kwobj.cgi?sKwObjAct=showpage&iPageIdx=1` | `doc/kwobj1.htm` |
| [x] | Keyword Group | — | `/cgi-bin/kwgrp.cgi?sKwGrpAct=showpage&iPageIdx=1` | `doc/kwgrp1.htm` |
| [x] | File Extension Object | — | `/cgi-bin/fextobj.cgi?sFileExtAct=showpage` | `doc/fextobj1.htm` |
| [x] | SMS/Mail Service Object | — | `/cgi-bin/sms.cgi?sProfileAct=showpage` | `doc/sms1.htm` |
| [x] | Notification Object | — | `/cgi-bin/sms.cgi?sProfileAct=notishowpage` | `doc/notify1.htm` |
| [x] | String Object | — | `/cgi-bin/striobj.cgi?sAct=0&iPage=1` | `doc/stringobj.htm` |
| [x] | Country Object | — | `/cgi-bin/cntrobj.cgi?sCnObjAct=showpage` | `doc/cntrobj1.htm` |
| [x] | Objects Backup/Restore | 2075 | `/cgi-bin/v2x00.cgi?fid=2075` | `doc/objbackup.htm` |

## 13. CSM — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | APP Enforcement Profile | — | `/cgi-bin/appeprof.cgi?sProfileAct=showpage` | `doc/appeprof1.htm` |
| [x] | URL Content Filter Profile | 2006 | `/cgi-bin/v2x00.cgi?fid=2006&sAct=showpage&iPageIdx=1` | `doc/cf1.HTM` |
| [x] | Web Content Filter Profile | — | `/cgi-bin/cgiwcf.cgi?iOpt=0` | `doc/wcf1.htm` |
| [x] | DNS Filter Profile | 2328 | `/cgi-bin/v2x00.cgi?fid=2328&iAct=0` | `doc/dnsfilter.htm` |

## 14. Bandwidth Management — 4 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Sessions Limit | 2092 | `/cgi-bin/v2x00.cgi?fid=2092` | `doc/ipsession.htm` |
| [x] | Bandwidth Limit | 2093 | `/cgi-bin/v2x00.cgi?fid=2093` | `doc/ipbandw.htm` |
| [x] | Quality of Service | 0 | `/cgi-bin/qos.cgi?fid=0` | `doc/qosgen1.htm` |
| [x] | APP QoS | — | `/cgi-bin/appqos.cgi?iAct=0` | `doc/appqos.htm` |

## 15. Applications — 12 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Dynamic DNS | 2055 | `/cgi-bin/v2x00.cgi?fid=2055` | `doc/ddns.htm` |
| [x] | LAN DNS / DNS Forwarding | 2326 | `/cgi-bin/v2x00.cgi?fid=2326&iPageIdx=1&iOption=0` | `doc/landns.htm` |
| [x] | DNS Security | 2337 | `/cgi-bin/v2x00.cgi?fid=2337` | `doc/dnsSec.htm` |
| [x] | Schedule | 2056 | `/cgi-bin/v2x00.cgi?fid=2056` | `doc/schedu1.htm` |
| [x] | RADIUS/TACACS+ | 0 | `/cgi-bin/cgiapp.cgi?fid=0` | `doc/RADIUS.HTM` |
| [x] | Active Directory / LDAP | 2118 | `/cgi-bin/v2x00.cgi?fid=2118` | `doc/ldap.htm` |
| [x] | UPnP | 2007 | `/cgi-bin/v2x00.cgi?fid=2007` | `doc/upnp.htm` |
| [x] | IGMP | 2111 | `/cgi-bin/v2x00.cgi?fid=2111` | `doc/IGMP.htm` |
| [x] | Wake on LAN/WAN | 2094 | `/cgi-bin/v2x00.cgi?fid=2094` | `doc/wakeonlan.htm` |
| [x] | SMS/Mail Alert Service | — | `/cgi-bin/sms.cgi?sProfileAct=servshowpage` | `doc/smsserv.htm` |
| [x] | Bonjour | 2217 | `/cgi-bin/v2x00.cgi?fid=2217` | `doc/bonjour.htm` |
| [x] | High Availability | 2127 | `/cgi-bin/v2x00.cgi?fid=2127&sProfileAct=1` | `doc/ha.htm` |

## 16. VPN and Remote Access — 12 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Remote Access Control | 2035 | `/cgi-bin/v2x00.cgi?fid=2035` | `doc/RAccCtl.htm` |
| [x] | PPP General Setup | 2036 | `/cgi-bin/v2x00.cgi?fid=2036` | `doc/dialin.sht` |
| [x] | SSL General Setup | 4005 | `/cgi-bin/v2x00.cgi?fid=4005` | `doc/ssl.htm` |
| [x] | IPsec General Setup | 2037 | `/cgi-bin/v2x00.cgi?fid=2037` | `doc/sec.htm` |
| [x] | IPsec Peer Identity | 1230 | `/cgi-bin/v2x00.cgi?fid=1230&sAct=showpage&iPageIdx=1&iProfileIdx=0` | `doc/XPID1.HTM` |
| [x] | VPN Matcher Setup | 2204 | `/cgi-bin/v2x00.cgi?fid=2204&sAct=showsrv` | `doc/cloudvpn1.htm` |
| [x] | OpenVPN | 2410 | `/cgi-bin/v2x00.cgi?fid=2410&sAct=showpage` | `doc/openvpnMn.htm` |
| [x] | WireGuard | 2507 | `/cgi-bin/v2x00.cgi?fid=2507` | `doc/wireguard.htm` |
| [x] | Remote Dial-in User | — | `/cgi-bin/dialin.cgi?sAct=showpage&iPageIdx=1&iProfileIdx=1&iSSLIdx=0` | `doc/dialini1.htm` |
| [x] | LAN to LAN | — | `/cgi-bin/lan2lan.cgi?sAct=showpage&iPageIdx=1&iProfileIdx=0` | `doc/lan2lan1.htm` |
| [x] | VPN TRUNK Management | 2400 | `/cgi-bin/v2x00.cgi?fid=2400&sAct=showpage` | `doc/vpntrunk.htm` |
| [x] | Connection Management | 34 | `/cgi-bin/v2x00.cgi?fid=34` | `doc/vpnstatu.htm` |

## 17. Certificate Management — 5 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Local Certificate | 1210 | `/cgi-bin/v2x00.cgi?fid=1210` | `doc/XLoCf1.HTM` |
| [x] | Trusted CA Certificate | 1220 | `/cgi-bin/v2x00.cgi?fid=1220` | `doc/XCaCf.HTM` |
| [x] | Certificate Backup | 1222 | `/cgi-bin/v2x00.cgi?fid=1222` | `doc/XBakRest.htm` |
| [x] | Self-Signed Certificate | 1218 | `/cgi-bin/v2x00.cgi?fid=1218&iCert=1` | `doc/XSelfV.HTM` |
| [x] | Local Services List | 1226 | `/cgi-bin/v2x00.cgi?fid=1226` | `doc/XLoSrv.htm` |

## 18. USB Application — 7 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | USB General Settings | — | `/cgi-bin/ftpset.cgi?sProfileAct=showpage` | `doc/ftpgenset.htm` |
| [x] | USB User Management | — | `/cgi-bin/ftpmng.cgi?sProfileAct=showpage` | `doc/ftpuser1.htm` |
| [x] | File Explorer | — | `/doc/usbweb.htm` | `doc/usbweb.htm` |
| [x] | USB Device Status | — | `/cgi-bin/ftp.cgi?sProfileAct=showpage` | `doc/ftpstat.htm` |
| [x] | Temperature Sensor | — | `/cgi-bin/usbtemper.cgi?sProfileAct=status_show` | `doc/usbTemperStat.htm` |
| [x] | Modem Support List | 2329 | `/cgi-bin/v2x00.cgi?fid=2329` | `doc/usbmodemlst.htm` |
| [x] | SMB Client Support List | 2336 | `/cgi-bin/v2x00.cgi?fid=2336` | `doc/usbSMBclientlst.htm` |

## 19. System Maintenance — 19 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | System Status | 2015 | `/cgi-bin/v2x00.cgi?fid=2015` | `doc/status.htm` |
| [x] | TR-069 | 1300 | `/cgi-bin/v2x00.cgi?fid=1300` | `doc/tr069.htm` |
| [x] | NetFlow | 2412 | `/cgi-bin/v2x00.cgi?fid=2412` | `doc/netflow.htm` |
| [x] | Administrator Password | 2029 | `/cgi-bin/v2x00.cgi?fid=2029` | `doc/chglog.sht` |
| [x] | User Password | 2183 | `/cgi-bin/v2x00.cgi?fid=2183` | `doc/chgbas2.htm` |
| [x] | Login Page Greeting | 2188 | `/cgi-bin/v2x00.cgi?fid=2188` | `doc/usergensetMn.htm` |
| [x] | Configuration Backup | 2016 | `/cgi-bin/v2x00.cgi?fid=2016` | `doc/cfgrest.htm` |
| [x] | Webhook | 2701 | `/cgi-bin/v2x00.cgi?fid=2701` | `doc/webhook.htm` |
| [x] | SysLog / Mail Alert | 2017 | `/cgi-bin/v2x00.cgi?fid=2017` | `doc/syslog.htm` |
| [x] | Time and Date | 6 | `/cgi-bin/v2x00.cgi?fid=6` | `doc/time.sht` |
| [x] | SNMP | 2224 | `/cgi-bin/v2x00.cgi?fid=2224` | `doc/snmp.htm` |
| [x] | Management | 2041 | `/cgi-bin/v2x00.cgi?fid=2041` | `doc/acontrol.sht` |
| [x] | Panel Control | — | `/cgi-bin/panelctl.cgi` | `doc/panelctrl.htm` |
| [x] | Self-Signed Certificate | 1218 | `/cgi-bin/v2x00.cgi?fid=1218` | `doc/XSelfV.HTM` |
| [x] | Reboot System | 2201 | `/cgi-bin/v2x00.cgi?fid=2201` | `doc/rebootsys.sht` |
| [x] | Firmware Upgrade | 2019 | `/cgi-bin/v2x00.cgi?fid=2019` | `doc/FWupgrade.htm` |
| [x] | Firmware Backup | 3100 | `/cgi-bin/v2x00.cgi?fid=3100` | `doc/fwbak.htm` |
| [x] | Internal Service User List | 8 | `/cgi-bin/fwuser.cgi?fid=8&iPageIdx=1&iUserMgtProIdx=200` | `doc/radiususer1.htm` |
| [x] | Dashboard Control | 2074 | `/cgi-bin/v2x00.cgi?fid=2074` | `doc/dashctl.htm` |

## 20. Diagnostics — 16 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | Dial-out Triggering | — | `/cgi-bin/diglan.cgi` | `doc/tpacket.sht` |
| [x] | Routing Table | — | `/cgi-bin/iprt.cgi` | `doc/iprtbl.sht` |
| [x] | ARP Cache Table | — | `/cgi-bin/arp.cgi` | `doc/iparptbl.sht` |
| [x] | DHCP Table | — | `/cgi-bin/dhcp.cgi` | `doc/ipdhcptbAdv.htm` |
| [x] | NAT Sessions Table | — | `/cgi-bin/ipnatpm.cgi` | `doc/ipnatpm.sht` |
| [x] | DNS Cache Table | 2330 | `/cgi-bin/v2x00.cgi?fid=2330` | `doc/dnstbl.htm` |
| [x] | Ping Diagnosis | 2095 | `/cgi-bin/v2x00.cgi?fid=2095` | `doc/ipping.htm` |
| [x] | Data Flow Monitor | 2096 | `/cgi-bin/v2x00.cgi?fid=2096` | `doc/digdatam.htm` |
| [x] | Traffic Graph | 2098 | `/cgi-bin/v2x00.cgi?fid=2098` | `doc/trffgraph1.htm` |
| [x] | VPN Graph | 2129 | `/cgi-bin/v2x00.cgi?fid=2129` | `doc/vpngraphlog.htm` |
| [x] | Trace Route | 2097 | `/cgi-bin/v2x00.cgi?fid=2097` | `doc/iptracert.htm` |
| [x] | Syslog Explorer | 2107 | `/cgi-bin/v2x00.cgi?fid=2107` | `doc/weblog.htm` |
| [x] | High Availability Status | 2127 | `/cgi-bin/v2x00.cgi?fid=2127&sProfileAct=2` | `doc/hastate.htm` |
| [x] | Authentication Information | 11 | `/cgi-bin/fwuser.cgi?fid=11&iPageIdx=1` | `doc/authlist.htm` |
| [x] | DoS Flood Table | 0 | `/cgi-bin/cgiflood.cgi?fid=0&flgV4=1&flgV6=1` | `doc/dosfld.htm` |
| [x] | Route Policy Diagnosis | 4046 | `/cgi-bin/v2x00.cgi?fid=4046&iAct=0` | `doc/diagnose.htm` |

## 21. Central Management — 23 mục  ✅ XONG

| ✓ | Mục | fid | URL | Trang đích |
|---|-----|-----|-----|------------|
| [x] | General Setup | — | `/cgi-bin/cvm.cgi?type=opt` | `doc/cvmSetup.htm` |
| [x] | CPE Management | — | `/cgi-bin/cvm.cgi?type=cpe` | `doc/cvmList.htm` |
| [x] | VPN Management | — | `/cgi-bin/cvm.cgi?type=vpn` | `doc/cvmConn.htm` |
| [x] | Log &amp; Alert | — | `/cgi-bin/cvm.cgi?type=log` | `doc/cvmLog.htm` |
| [x] | Dashboard | 0 | `/cgi-bin/cgiapm.cgi?fid=0` | `doc/apmdashb.htm` |
| [x] | Status | 1 | `/cgi-bin/cgiapm.cgi?fid=1` | `doc/apmngtSta.htm` |
| [x] | WLAN Profile | 2 | `/cgi-bin/cgiapm.cgi?fid=2` | `doc/apwlprof.htm` |
| [x] | AP Maintenance | 3 | `/cgi-bin/cgiapm.cgi?fid=3` | `doc/apmaintenance.htm` |
| [x] | Traffic Graph | 3010 | `/cgi-bin/v2x00.cgi?fid=3010&pageap=1&iActive=0` | `doc/aptrffgraph1.htm` |
| [x] | Event Log | 6 | `/cgi-bin/cgiapm.cgi?fid=6` | `doc/apmlog.htm` |
| [x] | Total Traffic | 7 | `/cgi-bin/cgiapm.cgi?fid=7` | `doc/apmtrff.htm` |
| [x] | Station Number | 8 | `/cgi-bin/cgiapm.cgi?fid=8` | `doc/apmstation.htm` |
| [x] | Load Balance | 9 | `/cgi-bin/cgiapm.cgi?fid=9` | `doc/aploadblc.htm` |
| [x] | Status | 0 | `/cgi-bin/cgiswm.cgi?fid=0` | `doc/swmstatus.htm` |
| [x] | Profile | 5 | `/cgi-bin/cgiswm.cgi?fid=5` | `doc/swmgprf1.htm` |
| [x] | Group | 2 | `/cgi-bin/cgiswm.cgi?fid=2` | `doc/swmgrp1.htm` |
| [x] | Maintenance | 17 | `/cgi-bin/cgiswm.cgi?fid=17` | `doc/swmmaint.htm` |
| [x] | Alert and Log | 30 | `/cgi-bin/cgiswm.cgi?fid=30` | `doc/swmaltlog1.htm` |
| [x] | Database Setup | 37 | `/cgi-bin/cgiswm.cgi?fid=37` | `doc/swmaltlog4.htm` |
| [x] | Support List | — | `/doc/swmlist.htm` | `doc/swmlist.htm` |
| [x] | External Devices | 2103 | `/cgi-bin/v2x00.cgi?fid=2103` | `doc/extdev.htm` |
| [x] | Registration & Services | 213 | `/cgi-bin/v2x00.cgi?fid=213&ag=1` | `doc/updsigact.htm` |
| [x] | Service Status | 226 | `/cgi-bin/v2x00.cgi?fid=226` | `doc/servicelogin.htm` |
