function TcCheckSel(selitem, value){
	if(value=="N/A"){
		selitem.selectedIndex=0;
	}
	for(k=0;k<selitem.length;k++){
		if(selitem.options[k].value==value){
			selitem.selectedIndex=k;
		break;
		}
	}
}
function valDoValidateIntegerGain(Integer)
{   
   if(Integer.match("^[-0-9]+")) 
   { 
   	return true;
   }
   alert(_("JSVPIInValid"));
   return false;
}

function isValidMacAddress(address) {
   var c = '';
   var i = 0, j = 0;

   if ( address.toLowerCase() == 'ff:ff:ff:ff:ff:ff' )
   {
       return false;
   }

   addrParts = address.split(':');
   if ( addrParts.length != 6 ) return false;

   for (i = 0; i < 6; i++) {
      if ( addrParts[i] == '' )
         return false;

      if ( addrParts[i].length != 2)
      {
        return false;
      }

      if ( addrParts[i].length != 2)
      {
         return false;
      }

      for ( j = 0; j < addrParts[i].length; j++ ) {
         c = addrParts[i].toLowerCase().charAt(j);
         if ( (c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'f') )
            continue;
         else
            return false;
      }
   }

   return true;
}