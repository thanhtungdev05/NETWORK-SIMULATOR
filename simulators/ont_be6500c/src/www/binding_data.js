/* SINH TU DONG tu spec/binding.json boi src/tao_binding_data.py.
   DUNG SUA TAY FILE NAY -- sua spec/binding.json roi chay lai script.
   Moi dong trong spec/binding.json deu co truong _nguon chi ro trich
   o dau ra (ma goc hoac ban chup that). */
window.__BINDING = {
 "advanced__ddns": {
  "nhan_nut_luu": "Apply",
  "phu_thuoc": {
   "dynamicServer": {
    "tat_khi_tat": "customDDnsEnabled"
   },
   "username": {
    "tat_khi_tat": "customDDnsEnabled"
   },
   "password": {
    "tat_khi_tat": "customDDnsEnabled"
   },
   "hostname": {
    "tat_khi_tat": "customDDnsEnabled"
   }
  },
  "thong_bao": {
   "loi": "An error has occurred. Please try again."
  },
  "nguon": {
   "chinh": {
    "resource": "ddns/configurations",
    "dang": "mang_moi_phan_tu"
   }
  },
  "truong": {
   "customDDnsEnabled": {
    "duong_dan": "enabled",
    "nguon": "chinh"
   },
   "dynamicServer": {
    "duong_dan": "serviceProvider",
    "nguon": "chinh"
   },
   "username": {
    "duong_dan": "username",
    "nguon": "chinh"
   },
   "password": {
    "duong_dan": "password",
    "nguon": "chinh"
   },
   "hostname": {
    "duong_dan": "hostname",
    "nguon": "chinh"
   }
  }
 },
 "system__general": {
  "thong_bao": {
   "loi": "Changes saving failed, please try again."
  },
  "nguon": {
   "sysinfo": {
    "resource": "system/info",
    "resource_ghi": "system",
    "dang": "object"
   },
   "time": {
    "resource": "time",
    "dang": "object",
    "them_khi_ghi": {
     "enabled": true
    }
   }
  },
  "truong": {
   "hostname": {
    "nguon": "sysinfo",
    "duong_dan": "hostname"
   },
   "localTimeZone": {
    "nguon": "time",
    "duong_dan": "localTimeZone",
    "tuy_chon": [
     {
      "value": "AOE12",
      "label": "UTC-12:00 – Baker Island, Howland Island (uninhabited)"
     },
     {
      "value": "UTC11",
      "label": "UTC-11:00 – American Samoa, Niue"
     },
     {
      "value": "UTC10",
      "label": "UTC-10:00 – Hawaii, Aleutian Islands, Tahiti"
     },
     {
      "value": "UTC9",
      "label": "UTC-09:00 – Alaska"
     },
     {
      "value": "PST8PDT,M3.2.0,M11.1.0",
      "label": "UTC-08:00 – Pacific Time (US & Canada), Baja California"
     },
     {
      "value": "MST7MDT,M3.2.0,M11.1.0",
      "label": "UTC-07:00 – Mountain Time (US & Canada), Arizona"
     },
     {
      "value": "CST6CDT,M4.1.0,M10.5.0",
      "label": "UTC-06:00 – Central Time (US & Canada), Mexico City, Central America"
     },
     {
      "value": "EST5EDT,M3.2.0,M11.1.0",
      "label": "UTC-05:00 – Eastern Time (US & Canada), Bogota, Lima"
     },
     {
      "value": "AST4ADT,M3.2.0,M11.1.0",
      "label": "UTC-04:00 – Atlantic Time (Canada), Caracas, La Paz"
     },
     {
      "value": "UTC3",
      "label": "UTC-03:00 – Buenos Aires, Greenland, Montevideo"
     },
     {
      "value": "UTC2",
      "label": "UTC-02:00 – South Georgia/South Sandwich Islands"
     },
     {
      "value": "UTC1",
      "label": "UTC-01:00 – Azores, Cape Verde Islands"
     },
     {
      "value": "GMT0BST,M3.5.0/1,M10.5.0",
      "label": "UTC±00:00 – Greenwich Mean Time (GMT), London, Dublin, Lisbon"
     },
     {
      "value": "CET-1CEST,M3.5.0,M10.5.0/3",
      "label": "UTC+01:00 – Central European Time (CET), West Africa Time (WAT), Berlin, Paris, Rome"
     },
     {
      "value": "EET-2EEST,M3.5.0/3,M10.5.0/4",
      "label": "UTC+02:00 – Eastern European Time (EET), Cairo, Athens, South Africa"
     },
     {
      "value": "UTC-3",
      "label": "UTC+03:00 – Moscow, Nairobi, Baghdad, Saudi Arabia"
     },
     {
      "value": "UTC-4",
      "label": "UTC+04:00 – Dubai, Samara, Baku"
     },
     {
      "value": "UTC-5",
      "label": "UTC+05:00 – Pakistan Standard Time, Yekaterinburg, Islamabad"
     },
     {
      "value": "UTC-6",
      "label": "UTC+06:00 – Bangladesh, Bhutan, Omsk"
     },
     {
      "value": "UTC-7",
      "label": "UTC+07:00 – Indochina Time, Bangkok, Hanoi, Jakarta"
     },
     {
      "value": "UTC-8",
      "label": "UTC+08:00 – China Standard Time, Singapore, Perth, Beijing"
     },
     {
      "value": "UTC-9",
      "label": "UTC+09:00 – Japan Standard Time, Korea Standard Time, Yakutsk"
     },
     {
      "value": "UTC-10",
      "label": "UTC+10:00 – Australian Eastern Standard Time, Vladivostok"
     },
     {
      "value": "UTC-11",
      "label": "UTC+11:00 – Solomon Islands, Magadan, New Caledonia"
     },
     {
      "value": "UTC-12",
      "label": "UTC+12:00 – Fiji, Kamchatka, New Zealand Standard Time (NZST)"
     },
     {
      "value": "UTC-13",
      "label": "UTC+13:00 – Tonga, Samoa, Tokelau"
     }
    ]
   }
  }
 },
 "advanced__upnp": {
  "tu_luu": true,
  "thong_bao": {
   "thanh_cong_bat": "Enabled UPnP successfully.",
   "thanh_cong_tat": "Disable UPnP successfully.",
   "loi": "An error has occurred. Please try again."
  },
  "nguon": {
   "chinh": {
    "resource": "upnp",
    "dang": "object"
   }
  },
  "truong": {
   "enabled": {
    "duong_dan": "enabled",
    "nguon": "chinh"
   }
  }
 },
 "advanced__dmz": {
  "phu_thuoc": {
   "ipAddress": {
    "tat_khi_tat": "enabled"
   }
  },
  "thong_bao": {
   "loi": "An error has occurred. Please try again."
  },
  "nguon": {
   "chinh": {
    "resource": "dmz/configurations",
    "dang": "mang_loc",
    "loc": {
     "ipVersion": 4
    },
    "gui_kem_id": true
   }
  },
  "truong": {
   "enabled": {
    "duong_dan": "enabled",
    "nguon": "chinh"
   },
   "ipAddress": {
    "duong_dan": "ipAddress",
    "theo_nhan": "Device / IP",
    "hien_thi": "nhan_thiet_bi",
    "nguon": "chinh"
   }
  }
 },
 "security__firewall": {
  "phu_thuoc": {
   "dosDefense.tcpFlood.rate": {
    "tat_khi_tat": "dosDefense.tcpFlood.enabled"
   },
   "dosDefense.tcpFlood.burst": {
    "tat_khi_tat": "dosDefense.tcpFlood.enabled"
   },
   "dosDefense.udpFlood.rate": {
    "tat_khi_tat": "dosDefense.udpFlood.enabled"
   },
   "dosDefense.udpFlood.burst": {
    "tat_khi_tat": "dosDefense.udpFlood.enabled"
   },
   "dosDefense.icmpFlood.rate": {
    "tat_khi_tat": "dosDefense.icmpFlood.enabled"
   },
   "dosDefense.icmpFlood.burst": {
    "tat_khi_tat": "dosDefense.icmpFlood.enabled"
   },
   "dosDefense.portScan.rate": {
    "tat_khi_tat": "dosDefense.portScan.enabled"
   },
   "dosDefense.portScan.burst": {
    "tat_khi_tat": "dosDefense.portScan.enabled"
   }
  },
  "nguon": {
   "chinh": {
    "resource": "firewall",
    "dang": "object"
   }
  },
  "truong": {
   "spiEnabled": {
    "duong_dan": "spiEnabled",
    "nguon": "chinh"
   },
   "icmpPing.wanEnabled": {
    "duong_dan": "icmpPing.wanEnabled",
    "nguon": "chinh"
   },
   "dosDefense.enabled": {
    "duong_dan": "dosDefense.enabled",
    "nguon": "chinh"
   },
   "dosDefense.tcpFlood.enabled": {
    "duong_dan": "dosDefense.tcpFlood.enabled",
    "nguon": "chinh"
   },
   "dosDefense.tcpFlood.rate": {
    "duong_dan": "dosDefense.tcpFlood.rate",
    "nguon": "chinh"
   },
   "dosDefense.tcpFlood.burst": {
    "duong_dan": "dosDefense.tcpFlood.burst",
    "nguon": "chinh"
   },
   "dosDefense.udpFlood.enabled": {
    "duong_dan": "dosDefense.udpFlood.enabled",
    "nguon": "chinh"
   },
   "dosDefense.udpFlood.rate": {
    "duong_dan": "dosDefense.udpFlood.rate",
    "nguon": "chinh"
   },
   "dosDefense.udpFlood.burst": {
    "duong_dan": "dosDefense.udpFlood.burst",
    "nguon": "chinh"
   },
   "dosDefense.icmpFlood.enabled": {
    "duong_dan": "dosDefense.icmpFlood.enabled",
    "nguon": "chinh"
   },
   "dosDefense.icmpFlood.rate": {
    "duong_dan": "dosDefense.icmpFlood.rate",
    "nguon": "chinh"
   },
   "dosDefense.icmpFlood.burst": {
    "duong_dan": "dosDefense.icmpFlood.burst",
    "nguon": "chinh"
   },
   "dosDefense.portScan.enabled": {
    "duong_dan": "dosDefense.portScan.enabled",
    "nguon": "chinh"
   },
   "dosDefense.portScan.rate": {
    "duong_dan": "dosDefense.portScan.rate",
    "nguon": "chinh"
   },
   "dosDefense.portScan.burst": {
    "duong_dan": "dosDefense.portScan.burst",
    "nguon": "chinh"
   },
   "dosDefense.tcpFlagScan.enabled": {
    "duong_dan": "dosDefense.tcpFlagScan.enabled",
    "nguon": "chinh"
   },
   "dosDefense.land.enabled": {
    "duong_dan": "dosDefense.land.enabled",
    "nguon": "chinh"
   },
   "dosDefense.smurf.enabled": {
    "duong_dan": "dosDefense.smurf.enabled",
    "nguon": "chinh"
   },
   "dosDefense.pingOfDeath.enabled": {
    "duong_dan": "dosDefense.pingOfDeath.enabled",
    "nguon": "chinh"
   },
   "dosDefense.traceRoute.enabled": {
    "duong_dan": "dosDefense.traceRoute.enabled",
    "nguon": "chinh"
   },
   "dosDefense.icmpFragment.enabled": {
    "duong_dan": "dosDefense.icmpFragment.enabled",
    "nguon": "chinh"
   },
   "dosDefense.synFragment.enabled": {
    "duong_dan": "dosDefense.synFragment.enabled",
    "nguon": "chinh"
   },
   "dosDefense.fraggleAttack.enabled": {
    "duong_dan": "dosDefense.fraggleAttack.enabled",
    "nguon": "chinh"
   },
   "dosDefense.unknownProtocol.enabled": {
    "duong_dan": "dosDefense.unknownProtocol.enabled",
    "nguon": "chinh"
   }
  }
 }
};
window.__METHODS = {
 "access/http/connections": [
  "DELETE",
  "GET",
  "POST"
 ],
 "access/ssh/connections": [
  "DELETE",
  "GET",
  "POST"
 ],
 "alg": [
  "GET",
  "PATCH"
 ],
 "ddns": [
  "GET"
 ],
 "ddns/configurations": [
  "GET",
  "PATCH"
 ],
 "devices": [
  "GET"
 ],
 "dhcp/reservedHosts": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "dhcp/servers": [
  "GET",
  "PATCH"
 ],
 "diagnostic": [
  "POST"
 ],
 "dmz/configurations": [
  "GET",
  "PATCH"
 ],
 "eapProfiles": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "easyMesh": [
  "GET",
  "PATCH"
 ],
 "ethernetPorts": [
  "GET",
  "PATCH"
 ],
 "firewall": [
  "GET",
  "PATCH"
 ],
 "interfaces": [
  "GET"
 ],
 "interfaces/configurations": [
  "GET",
  "PATCH"
 ],
 "internetConnection": [
  "GET"
 ],
 "pon/status": [
  "GET"
 ],
 "portForwarding/policies": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "publicLan": [
  "GET",
  "PATCH"
 ],
 "publicLan/routing/reservedHosts": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "publicLan/staticNat/policies": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "radios": [
  "GET",
  "PATCH"
 ],
 "speedTest": [
  "POST"
 ],
 "speedTest/records/{id}": [
  "GET"
 ],
 "speedTest/servers": [
  "GET"
 ],
 "ssids": [
  "GET",
  "PATCH"
 ],
 "staticRouting/policies": [
  "DELETE",
  "GET",
  "PATCH",
  "POST"
 ],
 "system": [
  "PATCH"
 ],
 "system/info": [
  "GET"
 ],
 "system/logServer": [
  "GET",
  "PATCH"
 ],
 "system/logs": [
  "GET"
 ],
 "system/services/actions": [
  "POST"
 ],
 "system/services/cache": [
  "GET"
 ],
 "system/status": [
  "GET"
 ],
 "tcpdump/interfaces/{id}": [
  "GET"
 ],
 "tcpdump/interfaces/{id}/action": [
  "POST"
 ],
 "time": [
  "GET",
  "PATCH"
 ],
 "upnp": [
  "GET",
  "PATCH"
 ],
 "wizard": [
  "GET",
  "PATCH"
 ]
};
