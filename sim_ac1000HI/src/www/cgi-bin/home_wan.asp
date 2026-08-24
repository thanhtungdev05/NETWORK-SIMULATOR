

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/val.js"></script>
<script language="JavaScript" src="/wanfunc.js"></script>
<script language="JavaScript" src="/mac.js"></script>
<script language="JavaScript" src="OutVariant.asp"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>

<script type="text/javascript" src="/spin.js" ></script>

</head>
<script language="JavaScript">

//add for  show cache image in webgui when click the "save" button
function showSpin(){
        var opts = {
                  lines: 8, // The number of lines to draw
                  length: 0, // The length of each line
                  width: 6, // The line thickness
                  radius: 7, // The radius of the inner circle
                  scale: 1, // Scales overall size of the spinner
                  corners: 1, // Corner roundness (0..1)
                  color: '#999999', // CSS color or array of colors
                  fadeColor: '#transparent', // CSS color or array of colors
                  speed: 1.1, // Rounds per second
                  rotate: 0, // The rotation offset
                  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
                  direction: 1, // 1: clockwise, -1: counterclockwise
                  zIndex: 2e9, // The z-index (defaults to 2000000000)
                  className: 'spinner', // The CSS class to assign to the spinner
                  top: '50%', // Top position relative to parent
                  left: '50%', // Left position relative to parent
                  shadow:false, // Box-shadow for the lines
                  position: 'absolute' // Element positioning
                };

var target = document.getElementById('firstDiv');
var spinner = new Spinner(opts).spin(target);
}

function isInteger(value)
{   
        if (/^\d+$/.test(value)) 
        {
           return true;
        } 
        else 
        {
            return false;
        }
}

function doBarrierChange(){
        var pvc;

        pvc = document.Alpha_WAN.ptm_Barrier.selectedIndex;
        pvc += 8;
        document.Alpha_WAN.ptm_VC.value = pvc;
        document.Alpha_WAN.wanVCFlag.value = 1;
        //document.Alpha_WAN.wanBarrierFlag.value = 1;
        document.Alpha_WAN.submit();
        return;
}

function doServiceChange(){
        document.Alpha_WAN.wanVCFlag.value = 1;
        document.Alpha_WAN.service_num_flag.value = 1;
        document.Alpha_WAN.submit();
        return;
}

function onClickServiceSummary() {
        window.open("/cgi-bin/home_servlist.asp","Serv_List","toolbar=no,menubar=no,height=305, width=620,location=0,left=200,top=400");
        return false;
}

function doTransChange() {
        var pvc, hasAtm=0, hasPtm=0, hasWan0=0;

        pvc = document.Alpha_WAN.wan_TransMode.selectedIndex;





if(hasAtm==1 && hasPtm==1 && hasWan0==1){
//AtmPtmEther
        if(pvc==1) //ptm
                pvc = 8;
        else if(pvc==2) //ether
                pvc = 10;
}

if(hasAtm==1 && hasPtm==1 && hasWan0==0){
//AtmPtm, no Ether
        if(pvc==1) //ptm
                pvc = 8;
}

if(hasAtm==1 && hasPtm==0 && hasWan0==1){
//AtmEther, no Ptm
        if(pvc==1) //ether
                pvc = 10;
}

if(hasAtm==0 && hasPtm==1 && hasWan0==1){
//PtmEther, no Atm
        if(pvc==0) //ptm
                pvc = 8;
        else if(pvc==1) //ether
                pvc = 10;
}

if(hasAtm==0 && hasPtm==1 && hasWan0==0){
//Ptm, no AtmEther
        pvc = 8;
}

if(hasAtm==0 && hasPtm==0 && hasWan0==1){
//Ether, no AtmPtm
        pvc = 10;
}

        document.Alpha_WAN.ptm_VC.value = pvc;
        document.Alpha_WAN.wanVCFlag.value = 1;
        document.Alpha_WAN.wanTransFlag.value = 1;
        document.Alpha_WAN.wanBarrierFlag.value = 1;
        document.Alpha_WAN.submit();
        return;
}

function splitPPPUsername()
{
        var str = document.Alpha_WAN.username1.value;
        var str_array = str.split("@");
        document.Alpha_WAN.wan_PPPUsername.value = str_array[0];
        if (str_array[1] == "ttnet")
        {
                document.Alpha_WAN.wan_PPPDomain.selectedIndex = 0;
        }else{
                document.Alpha_WAN.wan_PPPDomain.selectedIndex = 1;
                document.Alpha_WAN.wan_CompanyName.value = "@" + str_array[1];
        }
}
function doDomainChange(domainIndex)
{
        if(domainIndex == 0)
        {
                document.Alpha_WAN.wan_CompanyName.style.display = "none";
                document.Alpha_WAN.wan_PPPDomain.style.width = "70px";
                document.getElementById("IFrame1").style.display = "none";
                document.getElementById("PPPUsername_ErrorMsg_TR").style.display = "none";
        }
        else
        {
                document.Alpha_WAN.wan_CompanyName.style.display = "";
                document.Alpha_WAN.wan_PPPDomain.style.width = "119px";
                document.getElementById("IFrame1").style.display = "";
                if(document.Alpha_WAN.wan_CompanyName.value == "")
                {
                        document.Alpha_WAN.wan_CompanyName.value = "Input service name";
                        document.Alpha_WAN.wan_CompanyName.style.color = "#c0c0c0";
                }
                else
                {
                        document.Alpha_WAN.wan_CompanyName.style.color = "#000000";
                }
        }
}
function setTtnetCompanyDefalutText(company)
{
        var companyvalue = company.value;
        if(company.value =="Input service name")
        {
                company.style.color = "#000000";
                company.value = "@";
                var range = company.createTextRange();
                range.moveStart('character',company.value.length);
                range.moveEnd('character',0);
                range.select();
        }
}
function TtnetCompanyCheck(company)
{
        var companyvalue = company.value;
        if(companyvalue=="@" || companyvalue=="" || companyvalue=="Input service name")
        {
                alert("Please don't forget to set a service name.");
                return true;
        }
        if(companyvalue.lastIndexOf("@")!=0 && companyvalue!="")
        {
                alert("Service name must be written as \"@Service name\".Please input @ and try again.");
                return true;
        }
        if(companyvalue.indexOf("ttnet")==-1 && companyvalue.indexOf("meb")==-1)
        {
                document.getElementById("PPPUsername_ErrorMsg_TR").style.display = "";
                return true;
        }else{
                        document.getElementById("PPPUsername_ErrorMsg_TR").style.display = "none";
                }
        return false;
}
function DomainRangeCheck(val)
{
        var re;
        re = /[^0-9a-z@]/;
        if( re.test(val) )
        return true;
        else
        return false;
}

function WANChkIdleTimeT() {
    var form=document.Alpha_WAN;
    if (form.wan_ConnectSelect[1].selected)
        form.wan_IdleTimeT.disabled = false;
    else
        form.wan_IdleTimeT.disabled = true;
}
function QosCheck() {
         var form=document.Alpha_WAN;
        switch(form.Alwan_QoS.selectedIndex) {

                case 0:
                case 1:
                        form.wan_PCR.disabled=false;
                        form.wan_SCR.disabled = true;
                        form.wan_MBS.disabled=true;
                        break;
                case 2:
                case 3:
                        form.wan_PCR.disabled=false;
                        form.wan_SCR.disabled = false;
                        form.wan_MBS.disabled=false;
                        break;

                }
 return;
}
function onClickPVCSummary() {
        window.open("/cgi-bin/home_pvclist.asp","PVC_List","toolbar=no,menubar=no,height=305, width=620,location=0,left=200,top=100");
    return false;
}

function doStatusChange() {
    var form = document.Alpha_WAN;

    if (form.wan_status.options[form.wan_status.selectedIndex].text == "Enable") {

       // if (form.wanTypeRadio[0].selected || form.wanTypeRadio[1].selected) {
                //modify wanTypeRadio selectedindex 1->3 ,0->2
        if (form.wanTypeRadio[2].selected || form.wanTypeRadio[3].selected) {
            if ((document.Alpha_WAN.wan_certificate.value == "")||(document.Alpha_WAN.wan_certificate.value == "N/A")) {
                //adding selected certificate name to hidden control
                var x = window.frames['Iframe2'].document.forms['Alpha_WAN'].elements['wan_cert']
                document.Alpha_WAN.wan_certificate.value = x.options[0].text;
            }
            if ((document.Alpha_WAN.wan_CA.value == "")||(document.Alpha_WAN.wan_CA.value == "N/A")) {
                //adding selected CA file name to hidden control
                var x = window.frames['Iframe3'].document.forms['Alpha_WAN'].elements['wan_trusted_ca']
                document.Alpha_WAN.wan_CA.value = x.options[0].text;
            }
            if ((document.Alpha_WAN.wan_HiddenBiDirectionalAuth.value == "") || (document.Alpha_WAN.wan_HiddenBiDirectionalAuth.value == "N/A")) {
                document.Alpha_WAN.wan_HiddenBiDirectionalAuth.value = "Yes";
            }

        }
    }
}

function doauthenticationChange() {
    if (document.Alpha_WAN.wan_authentication.checked) {
        document.Alpha_WAN.wan_HiddenBiDirectionalAuth.value = "Yes";
        document.Alpha_WAN.wan_authentication.value = "Yes";
        var x = window.frames['Iframe3'].document.forms['Alpha_WAN'].elements['wan_trusted_ca']
        x.disabled = false;
    }
    else {
        document.Alpha_WAN.wan_authentication.value = "No";
        document.Alpha_WAN.wan_HiddenBiDirectionalAuth.value = "No";
        var x = window.frames['Iframe3'].document.forms['Alpha_WAN'].elements['wan_trusted_ca']
        x.disabled = true;
    }
   // document.Alpha_WAN.submit();
}
function doVCChange() {
        document.Alpha_WAN.wanVCFlag.value = 1;
        document.Alpha_WAN.submit();
        return;
}


function doIPVersionChangeIPv4(){

        with (document.Alpha_WAN){
                setDisplay('div_isp0dsl', 0);
                setDisplay('div_isp1dsl', 0);
                setDisplay('div_isp2dsl', 0);

        /*
        if(ipVerRadio[0].selected)
        {//ipv4

                                setDisplay('div_ipv4nat_0', 0);
                                setDisplay('div_ipv4nat_1', 0);
                                setDisplay('div_ipv4IP', 0);

                                setDisplay('div_ipv4static', 0);//isp =1
                                if(document.forms[0].UserMode.value == 0)
                                        setDisplay('div_ipv4igp', 0); //isp =1

                        //if(wanTypeRadio[2].selected == true){
                //modify wanTypeRadio selectedindex 2->0
                        if(wanTypeRadio[0].selected == true){
                                setDisplay('div_ipv4getip', 0);//modify 1-->0
                                setDisplay('ipv4_nat', 1); 
                                setDisplay('PPP_MTU', 1);
                                //setDisplay('connondemand_info', 1);
                                pppStaticCheck();
                        }
                        else{
                                setDisplay('div_ipv4getip', 0);//isp =2
                        }

                        setDisplay('div_ipv6_staticip', 0); //
                        setDisplay('div_ipv6pdm', 0);
                        setDisplay('div_ipv6dhcp', 0);
                }

        else if(ipVerRadio[2].selected == true)
        {//ipv6
                        setDisplay('div_ipv4nat_0', 0);
                        setDisplay('div_ipv4nat_1', 0);
                        setDisplay('div_ipv4IP', 0);
                        setDisplay('div_ipv4static', 0);//isp =1
                        //setDisplay('ipv4_iptv',0);
           // setDisplay('ipv6_iptv',1);
            setDisplay('ipv4_nat', 0);
                        setDisplay('PPP_MTU', 0);
                        if(document.forms[0].UserMode.value == 0)
                                setDisplay('div_ipv4igp', 0); //isp =1
                        setDisplay('div_ipv4getip', 0);//isp =2

                                setDisplay('div_ipv6dhcp', 0);


                                setDisplay('div_ipv6_staticip', 0);

                        //if(wanTypeRadio[2].selected == true){
                //modify wanTypeRadio selectedindex 2->0 pppoe mode
                        if(wanTypeRadio[0].selected == true){
                                setDisplay('div_ipv6pdm', 0);
                                if(isDSLITESupported.value == "1")
                                        setDisplay('div_isp2dsl', 1);
                        }
                        else{
                                setDisplay('div_ipv6pdm', 0);
                        }
                }
*/
        //      else{//ipv4/ipv6     

              //  setDisplay('ipv4_iptv',1);
              //  setDisplay('ipv6_iptv',1);
                                setDisplay('div_ipv4nat_0', 0);
                                setDisplay('div_ipv4nat_1', 0);
                                setDisplay('div_ipv4IP', 0);
                                setDisplay('div_ipv6dhcp', 0);

                                setDisplay('div_ipv4static', 0);//isp =1
                                if(document.forms[0].UserMode.value == 0)
                                        setDisplay('div_ipv4igp', 0); //isp =1
                                setDisplay('div_ipv6_staticip', 0); //


                        //if(wanTypeRadio[2].selected == true){
                //modify wanTypeRadio selectedindex 2->0
                        if(wanTypeRadio[0].selected == true){
                                setDisplay('div_ipv4getip', 0);//isp =2 modify 1-->0
                                setDisplay('div_ipv6pdm', 0);
                                setDisplay('ipv4_nat', 1);
                                setDisplay('PPP_MTU', 1);
                        }
                        else{
                                setDisplay('div_ipv4getip', 0);//isp =2
                                setDisplay('div_ipv6pdm', 0);
                                setDisplay('ipv4_nat', 0);
                                setDisplay('PPP_MTU', 0);
                        }
        //      }       
        }

    return;
}

function doIPVersionChangeIPv6(){
        //document.Alpha_WAN.wanVCFlag.value = 1;
        //document.Alpha_WAN.IPVersion_Flag.value = 1;
        //document.Alpha_WAN.PPPDHCPv6Enable_Flag.value = 1;
        //document.Alpha_WAN.submit();
    return;
}

function doConTypeChange(object) {
    /*if(! check_vci()){
        document.Alpha_WAN.vciCheckFlag.value = 1;
        document.Alpha_WAN.wanVCFlag.value = 1;
        alert('The previous settings are reset.');
    }
        var encapLength = document.Alpha_WAN.wan_Encap.options.length; //identify bridge mode with other mode
        var flag1 = 0;
        var flag2 = 0;
        if(object.value == "0" || object.value == "1")
        {
                if(encapLength > 2)
                {
                        var encap = document.Alpha_WAN.wan_Encap[2].text;
                        if(encap == "PPPoA LLC" || encap == "PPPoA VC-Mux")//from PPPoA/PPPoE
                                flag1 = 1;
                }else if(encapLength = 2)//from bridge mode
                        flag1 = 1;
                if(flag1 == 1)
                {
                        document.Alpha_WAN.hidEncapFlag.value = "1";
                        document.Alpha_WAN.hidEncap.value = "1483 Bridged IP LLC";
                }
        }else if(object.value == "2")
        {
                if(encapLength > 2)
                {
                        var encap = document.Alpha_WAN.wan_Encap[2].text;
                        if(encap == "1483 Routed IP LLC(IPoA)" || encap == "1483 Routed IP VC-Mux")//from dynamic/static ip address
                                flag2 = 1;
                }else if(encapLength = 2) //from bridge mode
                        flag2 = 1;
                if(flag2 == 1)
                {
                        document.Alpha_WAN.hidEncapFlag.value = "1";
                        document.Alpha_WAN.hidEncap.value = "PPPoE LLC";
                }
        }*/
    //document.Alpha_WAN.submit();
        with (document.Alpha_WAN){
/*
                //if(wanTypeRadio[0].selected == true){
                //modify wanTypeRadio selectedindex 0->2
                if(wanTypeRadio[2].selected == true){
                        if (document.Alpha_WAN.is8021xsupport.value == "1") {
                                setDisplay('div_802_1x', 1);
                        }
                        else {
                                setDisplay('div_802_1x', 0);
                        }
                        setDisplay('div_isp0', 1);
                        setDisplay('div_isp1', 0);
                        setDisplay('div_isp2', 0);
                        setDisplay('div_isp3', 0);
                        //setDisplay('div_ispna', 0);

                }
                //else if(wanTypeRadio[1].selected == true){
                //modify wanTypeRadio selectedindex 1->3
                else if(wanTypeRadio[3].selected == true){
                        if (document.Alpha_WAN.is8021xsupport.value == "1") {
                                setDisplay('div_802_1x', 1);
                        }
                        else {
                                setDisplay('div_802_1x', 0);
                        }
                        setDisplay('div_isp0', 0);
                        setDisplay('div_isp1', 1);
                        setDisplay('div_isp2', 0);
                        setDisplay('div_isp3', 0);
                        //setDisplay('div_ispna', 0);

                }
*/

                //else if(wanTypeRadio[2].selected == true){
                //modify wanTypeRadio selectedindex 2->0
                 if(wanTypeRadio[0].selected == true){
                 //add to ensure wan_PPPGetIP=dynamic
                document.Alpha_WAN.wan_PPPGetIP[1].checked=true; 
                 //add to ensure wan_PPPGetIP=dynamic
                        setDisplay('div_802_1x', 0);
                        setDisplay('div_isp0', 0);
                        setDisplay('div_isp1', 0);
                        setDisplay('div_isp2', 1);
                        setDisplay('div_isp3', 0);
                        //setDisplay('div_ispna', 0);
                        pppStaticCheck();

                }
                //else if(wanTypeRadio[3].selected == true){
                //modify wanTypeRadio selectedindex 3->1
                else if(wanTypeRadio[1].selected == true){
                        setDisplay('div_802_1x', 0);
                        setDisplay('div_isp0', 0);
                        setDisplay('div_isp1', 0);
                        setDisplay('div_isp2', 0);
                        setDisplay('div_isp3', 1);
                        setDisplay('ipv4_nat', 0);
                        setDisplay('PPP_MTU', 0);
                        //setDisplay('div_ispna', 0);

                }

                doIPVersionChangeIPv4();
        }
    return;
}

function doEncapChange() {
    /*if(! check_vci()){
        document.Alpha_WAN.vciCheckFlag.value = 1;
        document.Alpha_WAN.wanEncapFlag.value = 1;
        document.Alpha_WAN.wanVCFlag.value = 1;
                alert('The previous settings are reset.');
                }
    document.Alpha_WAN.submit();*/
        
        with (document.Alpha_WAN){

/*
                //if(wanTypeRadio[0].selected == true){
                //modify wanTypeRadio selectedindex 0->2  dhcp mode
                if(wanTypeRadio[2].selected == true){
                        if((0 == wan_Encap0.selectedIndex) || (1 == wan_Encap0.selectedIndex)){
                                setDisplay('div_isp0encap', 1);
                        }
                        else{
                                setDisplay('div_isp0encap', 0);
                        }
                }
*/

/*
                //else if(wanTypeRadio[1].selected == true){
                //modify wanTypeRadio selectedindex 1->3  staticip mode
                else if(wanTypeRadio[3].selected == true){
                        if((0 == wan_Encap1.selectedIndex) || (1 == wan_Encap1.selectedIndex)){
                                setDisplay('div_isp1encap', 1);
                        }
                        else{
                                setDisplay('div_isp1encap', 0);
                        }
                }
*/

                //else if(wanTypeRadio[2].selected == true){
                //modify wanTypeRadio selectedindex 2->0  pppoe mode
                if(wanTypeRadio[0].selected == true){
                        if((0 == wan_Encap2.selectedIndex) || (1 == wan_Encap2.selectedIndex)){
                                setDisplay('div_isp2encap', 1);
                        }
                        else{
                                setDisplay('div_isp2encap', 0);
                        }
                }
        }
        
    return;
}
function DynamicCheck() {
    if (document.Alpha_WAN.wan_VC.selectedIndex > 0) {
       // document.Alpha_WAN.wanTypeRadio[0].disabled=true;
                //modify wanTypeRadio selectedindex 0->2
        document.Alpha_WAN.wanTypeRadio[2].disabled=true;
    }
    return;
}

/*
function idleTimeCheck() {
    var number = document.Alpha_WAN.wan_IdleTimeT.value.match("^[0-9]{1,5}$");

    if (document.Alpha_WAN.wan_ConnectSelect[1].selected) {
                if (number == null) {
                        alert("Invalid Connection of Demand Idle Time");
                        return true;
                }
        }
        return false;
}
*/
function check_vci()
{
        var value;
        var value1;
        var pvc;
        var form=document.Alpha_WAN;
        pvc = form.wan_VC.selectedIndex;
        value =form.Alwan_VCI.value;
        value1=form.Alwan_VPI.value;
        if(!isInteger(value))
        {
                alert('VCI must be a Interger');
                return false;
        }
        if(!isInteger(value1))
        {
                alert('VPI must be a Interger');
                return false;
        }
        if(parseInt(value) > 65535 || parseInt(value) < 32)
        {
                alert('VCI must be in the range 32~65535');
                return false;
        }

        if(pvc == 0)
        {
                if((value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 1)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 2)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 3)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 4)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 5)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI6.value && value1 == form.VPI6.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 6)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI7.value && value1 == form.VPI7.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        if(pvc == 7)
        {
                if((value == form.VCI0.value && value1 == form.VPI0.value) || (value == form.VCI1.value && value1 == form.VPI1.value) || (value == form.VCI2.value && value1 == form.VPI2.value) || (value == form.VCI3.value && value1 == form.VPI3.value) || (value == form.VCI4.value && value1 == form.VPI4.value) || (value == form.VCI5.value && value1 == form.VPI5.value) || (value == form.VCI6.value && value1 == form.VPI6.value))
                {
                        alert('Invalid VPI:' + value1 +' and VCI:' + value +'. Already used by another PVC');
                        return false;
                }
                return true;
        }
        return false;
}

function doDisablePPPv6()
{
        var form=document.Alpha_WAN;
        form.PPPDHCPv6Enable_Flag.value = 0;
        form.wanSaveFlag.value = 0;
        //form.submit();

}


function doEnablePPPv6()
{
        var form=document.Alpha_WAN;
        form.PPPDHCPv6Enable_Flag.value = 1;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function doPPPv6ModeSLAAC()
{
        var form=document.Alpha_WAN;
        form.PPPDHCPv6Mode_Flag.value = 0;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function doPPPv6ModeDHCP()
{
        var form=document.Alpha_WAN;
        form.PPPDHCPv6Mode_Flag.value = 1;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function doPPPv6PDDisable()
{
        var form=document.Alpha_WAN;
        form.IPv6PD_Flag.value = 0;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function doPPPv6PDEnable()
{
        var form=document.Alpha_WAN;
        form.IPv6PD_Flag.value = 1;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function  doPPPv6ModeStatic()
{
        var form=document.Alpha_WAN;
        form.PPPDHCPv6Mode_Flag.value = 2;
        form.wanSaveFlag.value = 0;
        //form.submit();
}

function doDSLiteEnable(index)
{
        var form=document.Alpha_WAN;
        form.wanSaveFlag.value = 0;
        //form.submit();
        with (document.Alpha_WAN) {
                if (0 == index){
                        setDisplay('div_dslite0_0', 1);
                        setDisplay('div_dslite0_1', 1);
                }
                else if (1 == index){
                        setDisplay('div_dslite1_0', 1);
                        setDisplay('div_dslite1_1', 1);
                }
                else if (2 == index){
                        setDisplay('div_dslite2_0', 1);
                        setDisplay('div_dslite2_1', 1);
                }
        }
}

function doDSLiteDisable(index)
{
        var form=document.Alpha_WAN;
        form.wanSaveFlag.value = 0;
        //form.submit();
        with (document.Alpha_WAN) {
                if (0 == index){
                        setDisplay('div_dslite0_0', 0);
                        setDisplay('div_dslite0_1', 0);
                }
                else if (1 == index){
                        setDisplay('div_dslite1_0', 0);
                        setDisplay('div_dslite1_1', 0);
                }
                else if (2 == index){
                        setDisplay('div_dslite2_0', 0);
                        setDisplay('div_dslite2_1', 0);
                }
        }
}
function doWanActiveYes()
{
        if(document.Alpha_WAN.WAN_DefaultRoute2[0].checked){
                with (document.Alpha_WAN){
                        setDisplay('set_wandns0', 1);
                        setDisplay('set_wandns1', 1);
                        setDisplay('set_wandns2', 1);
                }
        }else{
                with (document.Alpha_WAN){
                        setDisplay('set_wandns0', 0);
                        setDisplay('set_wandns1', 0);
                        setDisplay('set_wandns2', 0);
                }
        }
}

function doWanActiveNo()
{
        with (document.Alpha_WAN){
                setDisplay('set_wandns0', 0);
                setDisplay('set_wandns1', 0);
                setDisplay('set_wandns2', 0);
        }
}

function doDefaultRouteNo()
{
        var form=document.Alpha_WAN;
        value = form.isDSLITESupported.value;
        if(value == 1){
/*      
                //if(form.wanTypeRadio[0].selected){
                //modify wanTypeRadio selectedindex 0->2  dhcp mode 
                if(form.wanTypeRadio[2].selected){
                        if(form.DSLITEEnableRadio0[0].checked){
                                form.DSLITEModeRadio0[0].disabled = true;
                                form.DSLITEModeRadio0[1].disabled = true;
                                form.DSLITEAddr0.disabled = true;
                        }
                        form.DSLITEEnableRadio0[0].disabled = true;
                        form.DSLITEEnableRadio0[1].disabled = true;
                }
                //else if(form.wanTypeRadio[1].selected){
                //modify wanTypeRadio selectedindex 1->3  staticip mode
                else if(form.wanTypeRadio[3].selected){
                        if(form.DSLITEEnableRadio1[0].checked){
                                form.DSLITEModeRadio1[0].disabled = true;
                                form.DSLITEModeRadio1[1].disabled = true;
                                form.DSLITEAddr1.disabled = true;
                        }
                        form.DSLITEEnableRadio1[0].disabled = true;
                        form.DSLITEEnableRadio1[1].disabled = true;
                }
*/
                //else if(form.wanTypeRadio[2].selected){
                //modify wanTypeRadio selectedindex 2->0
                 if(form.wanTypeRadio[0].selected){
                        if(form.DSLITEEnableRadio2[0].checked){
                                form.DSLITEModeRadio2[0].disabled = true;
                                form.DSLITEModeRadio2[1].disabled = true;
                                form.DSLITEAddr2.disabled = true;
                        }
                        form.DSLITEEnableRadio2[0].disabled = true;
                        form.DSLITEEnableRadio2[1].disabled = true;
                }
        }
        with (document.Alpha_WAN){
                setDisplay('set_wandns0', 0);
                setDisplay('set_wandns1', 0);
                setDisplay('set_wandns2', 0);
                }
}

function doDefaultRouteYes()
{
        var form=document.Alpha_WAN;
        value = form.isDSLITESupported.value;
        if(value == 1){
/*     
                //if(form.wanTypeRadio[0].selected){
                //modify wanTypeRadio selectedindex 0->2  dhcp mode
                if(form.wanTypeRadio[2].selected){
                        if(form.DSLITEEnableRadio0[0].checked){
                                form.DSLITEModeRadio0[0].disabled = false;
                                form.DSLITEModeRadio0[1].disabled = false;
                                form.DSLITEAddr0.disabled = false;
                        }
                        form.DSLITEEnableRadio0[0].disabled = false;
                        form.DSLITEEnableRadio0[1].disabled = false;
                }
                //else if(form.wanTypeRadio[1].selected){
                //modify wanTypeRadio selectedindex 1->3  staticip mode
                else if(form.wanTypeRadio[3].selected){
                        if(form.DSLITEEnableRadio1[0].checked){
                                form.DSLITEModeRadio1[0].disabled = false;
                                form.DSLITEModeRadio1[1].disabled = false;
                                form.DSLITEAddr1.disabled = false;
                        }
                        form.DSLITEEnableRadio1[0].disabled = false;
                        form.DSLITEEnableRadio1[1].disabled = false;
                }
*/
                //else if(form.wanTypeRadio[2].selected){
                //modify wanTypeRadio selectedindex 2->0
                 if(form.wanTypeRadio[0].selected){
                        if(form.DSLITEEnableRadio2[0].checked){
                                form.DSLITEModeRadio2[0].disabled = false;
                                form.DSLITEModeRadio2[1].disabled = false;
                                form.DSLITEAddr2.disabled = false;
                        }
                        form.DSLITEEnableRadio2[0].disabled = false;
                        form.DSLITEEnableRadio2[1].disabled = false;
                }
        }
        if(form.wan_VCStatus[0].checked){
        with (document.Alpha_WAN){
                setDisplay('set_wandns0', 1);
                setDisplay('set_wandns1', 1);
                setDisplay('set_wandns2', 1);
                }
        }else{
                with (document.Alpha_WAN){
                setDisplay('set_wandns0', 0);
                setDisplay('set_wandns1', 0);
                setDisplay('set_wandns2', 0);
                }
        }
}
function autoDNSRelay()
{
        document.Alpha_WAN.PrimaryDns.disabled = true;
        document.Alpha_WAN.SecondDns.disabled = true;
}

function manualDNSRelay()
{
        document.Alpha_WAN.PrimaryDns.disabled = false;
        document.Alpha_WAN.SecondDns.disabled = false;
}

function doDSLiteModeAuto()
{
        var form=document.Alpha_WAN;
/*
        //if(form.wanTypeRadio[0].selected){
                //modify wanTypeRadio selectedindex 0->2  dhcp mode 
        if(form.wanTypeRadio[2].selected){
                form.DSLITEAddr0.disabled = true;
        }
        //else if(form.wanTypeRadio[1].selected){
                //modify wanTypeRadio selectedindex 1->3  staticip mode
        else if(form.wanTypeRadio[3].selected){
                form.DSLITEAddr1.disabled = true;
        }
*/
        //else if(form.wanTypeRadio[2].selected){
                //modify wanTypeRadio selectedindex 2->0  pppoe mode
         if(form.wanTypeRadio[0].selected){
                form.DSLITEAddr2.disabled = true;
        }
}

function doDSLiteModeManual()
{
        var form=document.Alpha_WAN;
/*
        //if(form.wanTypeRadio[0].selected){
                //modify wanTypeRadio selectedindex 0->2  dhcp mode 
        if(form.wanTypeRadio[2].selected){
                form.DSLITEAddr0.disabled = false;
        }
        //else if(form.wanTypeRadio[1].selected){
                //modify wanTypeRadio selectedindex 1->3  staticip mode
        else if(form.wanTypeRadio[3].selected){
                form.DSLITEAddr1.disabled = false;
        }
*/
        //else if(form.wanTypeRadio[2].selected){
                //modify wanTypeRadio selectedindex 2->0  pppoemode
         if(form.wanTypeRadio[0].selected){
                form.DSLITEAddr2.disabled = false;
        }
}

function check_wan_vid()
{

        var form=document.Alpha_WAN;
        if((form.wan_8021q.value==1) && (form.disp_wan_8021q.value==1) && (form.wan_dot1q[0].selected)){
                value = form.wan_vid.value;

                if(!isNumeric(value)){
                        alert('VLANID must be in the range 0~4095');
                        return false;
                }

                if(parseInt(value) > 4095  || parseInt(value) < 0)
                {
                        alert('VLANID must be in the range 0~4095');
                        return false;
                }

        }

        return true;
}


function isNumericPlus(s)
{
  var len= s.length;
  var ch;
  if(len==0)
    return false;
    
  i=0;
  ch = s.charAt(i);

  if(ch == '-'){
    if(len == 1)
      return false;
    else
      i++;
  }

  for(; i< len; i++)
  {
    ch= s.charAt(i);
    if( ch > '9' || ch < '0')
    {
      return false;
    }
  }
  return true;
}

function check_wan_mvlan()
{
        var form=document.Alpha_WAN;
        value = form.wan_mvlan.value;

        if(!isNumericPlus(value)){
                alert('Multi VLan must be in the range -1~4095');
                return false;
        }

        if(parseInt(value) > 4095  || parseInt(value) < -1)
        {
                alert('Multi VLan must be in the range -1~4095');
                return false;
        }
        return true;
}


function check_wan_dot1p()
{
        var form=document.Alpha_WAN;
        if((form.wan_8021q.value==1) && (form.disp_wan_8021q.value==1) && (form.wan_dot1q[0].selected)){
                value = form.wan_dot1p.value;

                if(!isNumeric(value)){
                        alert('802.1p must be in the range 0~7');
                        return false;
                }

                if(parseInt(value) > 7  || parseInt(value) < 0)
                {
                        alert('802.1p must be in the range 0~7');
                        return false;
                }
        }
        return true;
}


function check_ipv4()
{
        var value;
        var value_temp;
        var form=document.Alpha_WAN;
        var IPAddrValue,maskValue;


        value = form.wan_StaticIPaddr1.value;
        if (inValidIPAddrV2(value))
                return false;

        value = form.wan_StaticIPSubMask1.value;
        if (inValidSubnetMask(value))
                return false;
        value = form.wan_StaticIPaddr1.value;
        value_temp = form.wan_StaticIPSubMask1.value;
        if(inValidNetAddrV01(value,value_temp))
                {
                return false;
                }
        value = form.wan_StaticIpGateway1.value;
        if (inValidIPAddrV2(value))
                return false;
        value = form.wan_StaticIPaddr1.value;
        value_temp = form.wan_StaticIPSubMask1.value;
        value_gate = form.wan_StaticIpGateway1.value;
        if(inValidGatewayV01(value,value_temp,value_gate))
                return false;
        
        IPAddrValue =  form.wan_StaticIPaddr1.value;
        maskValue = form.wan_StaticIPSubMask1.value;
        if(inValidStaticIPSubNet(IPAddrValue,maskValue))
                return false;


                return true;

}


function check_ipv6()
{

        var value;
        var form=document.Alpha_WAN;


        //check IPv6 Address format
        value = form.wan_IPv6Addr.value;
        if(inValidIPv6AddrV2(value))
        {
                return false;
        }

        //check IPv6 Prefix
        value = form.wan_IPv6Prefix.value;
        if(inValidIPv6PrefixV2(value))
        {
                return false;
        }
        //check IPV6 Gateway Address format
        value = form.wan_IPv6DefGw.value;
        if(inValidIPv6AddrV2(value))
        {
                return false;
        }
        value = form.wan_IPv6DNS1.value;
        
        if(inValidIPv6AddrV2(value))
        
                return false;

        value = form.wan_IPv6DNS2.value;
        
        if(inValidIPv6AddrV2(value))
        
                return false;

        /*
        value = form.isDSLITESupported.value;
        if(value == 1){
        if(form.ipVerRadio[2].selected && form.DSLITEEnableRadio1[0].checked){
                value = form.DSLITEAddr1.value;
                if(inValidIPv6AddrV2(value))
                return false;

                }
        }
        */
        return true;
                                           
        }


function uiSave() {
        var value;
        var form=document.Alpha_WAN;
        var pvc, barrier, hasAtm=0, hasPtm=0, hasWan0=0, hasPon = 0;
        var vpi,vci;
        var IPAddrValue,maskValue;





        hasPon = 1;

if (hasPon==1)
        pvc = 8;
else{
if(hasAtm==1 && hasPtm==1 && hasWan0==1){
//AtmPtmEther
        pvc=form.wan_TransMode.selectedIndex;
        if(pvc==1){ //ptm
                //barrier = document.Alpha_WAN.ptm_Barrier.selectedIndex;
                //if(barrier==0)
                        pvc = 8;
                //else
                //      pvc = 9;
        }
        else if(pvc==2) //ether
                pvc = 10;
}
if(hasAtm==1 && hasPtm==1 && hasWan0==0){
//AtmPtm, no Ether
        pvc=form.wan_TransMode.selectedIndex;
        if(pvc==1){ //ptm
                //barrier = document.Alpha_WAN.ptm_Barrier.selectedIndex;
                //if(barrier==0)
                        pvc = 8;
                //else
                //      pvc = 9;
        }
}

if(hasAtm==1 && hasPtm==0 && hasWan0==1){
//AtmEther, no Ptm
        pvc=form.wan_TransMode.selectedIndex;
        if(pvc==1) //ether
                pvc = 10;
}
if(hasAtm==0 && hasPtm==1 && hasWan0==1){
//PtmEther, no Atm
        pvc=form.wan_TransMode.selectedIndex;
        if(pvc==0){ //ptm
                //barrier = document.Alpha_WAN.ptm_Barrier.selectedIndex;
                //if(barrier==0)
                        pvc = 8;
                //else
                //      pvc = 9;
        }
        else if(pvc==1) //ether
                pvc = 10;
}

if(hasAtm==0 && hasPtm==1 && hasWan0==0){
//Ptm, no AtmEther
        //barrier = document.Alpha_WAN.ptm_Barrier.selectedIndex;
        //if(barrier==0)
                pvc = 8;
        //else
        //      pvc = 9;
}

if(hasAtm==0 && hasPtm==0 && hasWan0==1){
//Ether, no AtmPtm
        pvc = 10;
}
}

        //ptm,ether
        form.ptm_VC.value = pvc;


        if(!check_wan_vid())
           return;


        if(!check_wan_mvlan())
           return;







/* 

        //if(form.wanTypeRadio[0].selected)
                //modify wanTypeRadio selectedindex 0->2
        if(form.wanTypeRadio[2].selected)
        {
                if(!isNumeric(form.wan_TCPMTU0.value))
                {
                        alert('TCP MTU must be digits!');
                        return false;
                }
                MTU = parseInt(form.wan_TCPMTU0.value);
            if((MTU > 1500 || MTU < 576) && MTU != 0)
            {
                alert("The range of TCP MTU: 576 ~ 1500 or 0 as default value");
                return false;
            }


                value = form.isIPv6Supported.value;
                if(value == 1){
                        if(form.ipVerRadio[1].selected || form.ipVerRadio[2].selected){

                                //check IPv6 Address format
                                form.DynIPv6Enable_flag.value = form.DynIPv6EnableRadio.value;
                                value = form.isDSLITESupported.value;
                                if(value == 1){
                                        if(form.ipVerRadio[2].selected && form.DSLITEEnableRadio0[0].checked){
                                                if(form.DSLITEModeRadio0[1].checked){
                                                        value = form.DSLITEAddr0.value;
                                                        if(inValidIPv6Addr(value))
                                                        return false;
                                                }
                                        }
                                }          
                        }
                }
        }
        //if(form.wanTypeRadio[1].selected)
                //modify wanTypeRadio selectedindex 1->3
        if(form.wanTypeRadio[3].selected)
        {

                        if(form.ipVerRadio[0].selected){
                                if(!check_ipv4())
                                {
                                        alert(" The IPv4 Options is invalid!");
                                        return;
                        }
                }


                if(!isNumeric(form.wan_TCPMTU1.value))
                {
                        alert('TCP MTU must be digits!');
                        return false;
                }
                MTU = parseInt(form.wan_TCPMTU1.value);
            if((MTU > 1500 || MTU < 100) && MTU != 0)
            {
                alert("The range of TCP MTU: 100 ~ 1500 or 0 as default value");
                return false;
            }

                value = form.isIPv6Supported.value;
                if(value == 1){
                        if( form.ipVerRadio[2].selected)
                        {
                                if(!check_ipv6())
                                {
                                        alert("The IPv6 Options is invalid!");
                                        return;
                                }
                                }

                        if( form.ipVerRadio[1].selected)
                        {
                                if(!check_ipv4() && !check_ipv6() )
                                {
                                        alert("The IPv4 and IPv6 Options are invalid!");
                                        return;
                                }
                                           
                        }
                }
        }
*/

        //else if(form.wanTypeRadio[2].selected)
                //modify wanTypeRadio selectedindex 2->0  pppoe mode
         if(form.wanTypeRadio[0].selected)
        {
                //if(idleTimeCheck())
                        //return ;
        if(form.TTNETGuiSupport.value ==1 ){
                if(form.wan_PPPDomain.selectedIndex == 0)
                {
                        form.username1.value = form.wan_PPPUsername.value + "@ttnet";
                }
                if(form.wan_PPPDomain.selectedIndex == 1)
                {
                        if(TtnetCompanyCheck(form.wan_CompanyName))
                                return;
                        if(DomainRangeCheck(document.Alpha_WAN.wan_CompanyName.value) == true)
                        {
                                document.getElementById("PPPUsername_ErrorMsg_TR").style.display = "";
                                return;
                        }else{
                                document.getElementById("PPPUsername_ErrorMsg_TR").style.display = "none";
                                }
                        form.username1.value = form.wan_PPPUsername.value + form.wan_CompanyName.value;
                }
        }
                if(isValidNameEx(form.wan_PPPUsername.value) == false ){
                        alert("username invalid!");
                        return;
                }
                if(isValidNameEx(form.wan_PPPPassword.value) == false ){
                        alert("password invalid!");
                        return;
                }
                if(form.wan_PPPUsername.value.length <= 0 || form.wan_PPPPassword.value.length <= 0){
          alert("please input username and password");
          return;
    }
                
                if(!isNumeric(form.wan_TCPMSS.value)){
                        alert("TCP MSS must be digits!");
                        return false;
                }
                MSS = parseInt(form.wan_TCPMSS.value);
                //if((MSS > 1452 || MSS < 100) && MSS != 0)
                //{
                //      alert("The range of TCP MSS: 100 ~ 1452 or 0 as default value");
                //      return false;
                //}
                
                if(form.ipv6SupportValue.value =="0")
                {
                        if(!isNumeric(form.wan_TCPMTU2.value))
                        {
                                alert('TCP MTU must be digits!');
                                return false;
                        }
                        var MTU = parseInt(form.wan_TCPMTU2.value);
                        if((MTU > 1500 || MTU < 100) && MTU!=0)
                        {
                                alert("The range of TCP MTU: 100~1500 or 0 as default value");
                                return false;
                        }
                        if(( MSS!=0 && MTU!=0 && MSS > MTU-40 ) || (MSS==0 && MTU!=0 &&MTU!=1500))
                        {
                                form.wan_TCPMSS.value=MTU-40;
                        //      alert("The range of TCP MSS must less than TCP MTU-40(tcp and ip header)");
                        //      return false;
                        }
                        if(MTU==0||MTU==1500)
                        {
                                form.wan_TCPMSS.value=0;
                        }
                }
                value = form.isIPv6Supported.value;
                if(value == 1){
                        //if(form.ipVerRadio[0].selected || form.ipVerRadio[1].selected){  

                                if(form.wan_PPPGetIP[0].checked)
                                {
                                        value = form.wan_StaticIPaddr2.value;
                                        if (inValidIPAddr(value))
                                                return;
                                        value = form.wan_StaticIPSubMask2.value;
                                        if (inValidSubnetMask(value))
                                                return;
                                        value = form.wan_StaticIpGateway2.value;
                                        if (inValidIPAddr(value))
                                                return;
                                        IPAddrValue =  form.wan_StaticIPaddr2.value;
                                        maskValue = form.wan_StaticIPSubMask2.value;
                                        if(inValidStaticIPSubNet(IPAddrValue,maskValue))
                                                return;

                                }
                                if(form.dnsTypeRadio[1].checked){
                                value = form.PrimaryDns.value;
                                if (inValidIPAddr(value))
                                        return;
                                value = form.SecondDns.value;
                                if (inValidIPAddr(value))
                                        return;
                                }
                        //}  
                }
                else{
                        if(form.wan_PPPGetIP[0].checked)
                        {
                                value = form.wan_StaticIPaddr2.value;
                                if (inValidIPAddr(value))
                                        return;
                                value = form.wan_StaticIPSubMask2.value;
                                if (inValidSubnetMask(value))
                                        return;
                                value = form.wan_StaticIpGateway2.value;
                                if (inValidIPAddr(value))
                                        return;
                                IPAddrValue =  form.wan_StaticIPaddr2.value;
                                maskValue = form.wan_StaticIPSubMask2.value;
                                if(inValidStaticIPSubNet(IPAddrValue,maskValue))
                                        return;
                        }
                        if(form.dnsTypeRadio[1].checked){
                        value = form.PrimaryDns.value;
                        if (inValidIPAddr(value))
                                return;
                        value = form.SecondDns.value;
                        if (inValidIPAddr(value))
                                return;
                        }
                }
                
                value = form.isIPv6Supported.value;
                if(value == 1){
                        //if(form.ipVerRadio[1].selected || form.ipVerRadio[2].selected) 
                        //{
                          if(!PPPv6Enable())
                                return false;
                                value = form.isDSLITESupported.value;
                                /*
                                if(value == 1){
                                if(form.ipVerRadio[2].selected && form.DSLITEEnableRadio2[0].checked){
                                        if(form.DSLITEModeRadio2[1].checked){
                                                value = form.DSLITEAddr2.value;
                                                if(inValidIPv6Addr(value))
                                                return false;
                                        }
                                }
                                }*/
                //      }
                }
        }

        showSpin();
        form.wanSaveFlag.value = 1;
        form.wanVCFlag.value = "3";
        form.submit();
}
function inValidStaticIPSubNet(staticIP,staticMask)
{


        return false;
}



function PPPv6Enable()
{
        var form=document.Alpha_WAN;
        //form.PPPIPv6EnableRadio[1].checked 
        if( form.PPPDHCPv6Enable_Flag.value == 1 )
        {
                value = processModeVar();
                if(!value)
                        return false;                                              
        }
        return true;
}


function doDisableDynIPv6()
{
        var form=document.Alpha_WAN;
        if( form.DynIPv6EnableRadio[0].ckecked)
        {
                form.DynIPv6Enable_flag.value = 0;
        }
}

function doEnableDynIPv6()
{
        var form=document.Alpha_WAN;
        if( form.DynIPv6EnableRadio[1].ckecked)
        {
                form.DynIPv6Enable_flag.value = 1;
        }
}

function processModeVar()
{
        var value;
        var form=document.Alpha_WAN;
        if(form.PPPIPv6ModeRadio[2].checked)
        {
                value = processIPV6format();
                if(!value)
                        return false;
        }
        return true;
}

function processIPV6format()
{
        var value;
        var form=document.Alpha_WAN;

        value = form.wan_IPv6Addr.value;
        if(inValidIPv6Addr(value))
                return false;

        value = form.wan_IPv6Prefix.value;
        if(inValidIPv6Prefix(value))
                return false;
 
        value = form.wan_IPv6DefGw.value;
        if(inValidIPv6Addr(value))
                return false;

        value = form.wan_IPv6DNS1.value;
        if(inValidIPv6Addr(value))
                return false;

        value = form.wan_IPv6DNS2.value;
        if(inValidIPv6Addr(value))
                return false;

        return true;
}
function valDoValidateNum(Num) {
    var number = Num.value.match("^[0-9]{1,5}$");
    if (number == null) {
        alert('Invalid number format!');
        Num.value = 0;
    }
}

function pppStaticCheck() {
        var form=document.Alpha_WAN;
        value = form.isIPv6Supported.value;
        if(value == 1){
                //if(form.ipVerRadio[0].selected || form.ipVerRadio[1].selected){ 
                        var value = document.Alpha_WAN.wan_PPPGetIP[1].checked;
                        var form=document.Alpha_WAN;
                        if (value) {
                                form.wan_StaticIPaddr2.disabled = true;
                                form.wan_StaticIPaddr2.value = "0.0.0.0";
                                form.wan_StaticIPSubMask2.disabled = true;
                                form.wan_StaticIPSubMask2.value = "0.0.0.0";
                                form.wan_StaticIpGateway2.disabled = true;
                                form.wan_StaticIpGateway2.value = "0.0.0.0";
                        } else {
                                form.wan_StaticIPaddr2.disabled = false;
                                form.wan_StaticIPSubMask2.disabled = true;
                                form.wan_StaticIPSubMask2.value = "255.255.255.255";
                                form.wan_StaticIpGateway2.disabled = false;
                        }
                //} 
        }
        else{
                        var value = document.Alpha_WAN.wan_PPPGetIP[1].checked;
                        var form=document.Alpha_WAN;
                        if (value) {
                                form.wan_StaticIPaddr2.disabled = true;
                                form.wan_StaticIPaddr2.value = "0.0.0.0";
                                form.wan_StaticIPSubMask2.disabled = true;
                                form.wan_StaticIPSubMask2.value = "0.0.0.0";
                                form.wan_StaticIpGateway2.disabled = true;
                                form.wan_StaticIpGateway2.value = "0.0.0.0";
                        } else {
                                form.wan_StaticIPaddr2.disabled = false;
                                form.wan_StaticIPSubMask2.disabled = true;
                                form.wan_StaticIPSubMask2.value = "255.255.255.255";
                                form.wan_StaticIpGateway2.disabled = false;
                        }
        }
}

function wanDNSCheck() {
        var value = document.Alpha_WAN.WAN_DefaultRoute2[0].checked;
        if(document.Alpha_WAN.wan_VCStatus[0].checked){
        if (value) {
                with (document.Alpha_WAN){
                        setDisplay('set_wandns0', 1);
                        setDisplay('set_wandns1', 1);
                        setDisplay('set_wandns2', 1);
                }
                        var value = document.Alpha_WAN.dnsTypeRadio[1].checked;
                        if(value){
                                document.Alpha_WAN.PrimaryDns.disabled = false;
                                document.Alpha_WAN.SecondDns.disabled = false;
                        }else{
                                document.Alpha_WAN.PrimaryDns.disabled = true;
                                document.Alpha_WAN.SecondDns.disabled = true;
                        }
                }else{
                        with (document.Alpha_WAN){
                                setDisplay('set_wandns0', 0);
                                setDisplay('set_wandns1', 0);
                                setDisplay('set_wandns2', 0);
                }
                        var value = document.Alpha_WAN.dnsTypeRadio[1].checked;
                        if(value){
                                document.Alpha_WAN.PrimaryDns.disabled = false;
                                document.Alpha_WAN.SecondDns.disabled = false;
                        }else{
                                document.Alpha_WAN.PrimaryDns.disabled = true;
                                document.Alpha_WAN.SecondDns.disabled = true;
                        }
                }
        }else{
        if (value) {
                with (document.Alpha_WAN){
                        setDisplay('set_wandns0', 0);
                        setDisplay('set_wandns1', 0);
                        setDisplay('set_wandns2', 0);
                }
                        var value = document.Alpha_WAN.dnsTypeRadio[1].checked;
                        if(value){
                                document.Alpha_WAN.PrimaryDns.disabled = false;
                                document.Alpha_WAN.SecondDns.disabled = false;
                        }else{
                                document.Alpha_WAN.PrimaryDns.disabled = true;
                                document.Alpha_WAN.SecondDns.disabled = true;
                        }
                }else{
                        with (document.Alpha_WAN){
                                setDisplay('set_wandns0', 0);
                                setDisplay('set_wandns1', 0);
                                setDisplay('set_wandns2', 0);
                }
                        var value = document.Alpha_WAN.dnsTypeRadio[1].checked;
                        if(value){
                                document.Alpha_WAN.PrimaryDns.disabled = false;
                                document.Alpha_WAN.SecondDns.disabled = false;
                        }else{
                                document.Alpha_WAN.PrimaryDns.disabled = true;
                                document.Alpha_WAN.SecondDns.disabled = true;
                        }
                }
        }
}
// Check if a name valid
function isValidNameEx(name) {
   var i = 0;
   
   for ( i = 0; i < name.length; i++ ) {
      if ( isNameUnsafeEx(name.charAt(i)) == true ){
                return false;
        }
   }

   return true;
}

function isNameUnsafeEx(compareChar)
{
   if ( compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 127)
      return false; // found no unsafe chars, return false
   else
      return true;
}

function quotationCheck(object) {
        var len = object.value.length;
        var c;
        var i;
    for (i = 0; i < len; i++)
    {
                 var c = object.value.charAt(i);
      
                 if (c == '"' || c == '$' || c == '\\' || c == '`')
                 {
                                alert('Can\'t input "quotation marks" or "dollar sign" or "backslash" or "acute accent" character!!');                                                                                           
                                return true;
                 }
    }
    
        return false;
}

function wanVidOper(onOff){
        var value;

        if(onOff != 1)
                value = true;
        else
                value = false;

        document.Alpha_WAN.wan_vid.disabled=value;

        if (document.Alpha_WAN.isdot1pSupport.value == "Yes") {
                document.Alpha_WAN.wan_dot1pRemark.disabled=value;
                if ((value == false) && (document.Alpha_WAN.wan_dot1pRemark.selectedIndex == 0))
                        document.Alpha_WAN.wan_dot1p.disabled=false;
                else
                        document.Alpha_WAN.wan_dot1p.disabled=true;
        }

        if (document.Alpha_WAN.isWanTagChk.value == "Yes")
                document.Alpha_WAN.TAGSEL.disabled = value;

        if (document.Alpha_WAN.isTPIDSupported.value == "Yes")
                document.Alpha_WAN.wan_tpid.disabled=value;

}

function wan8021QCheck() {
        var form=document.Alpha_WAN;
        if((form.wan_8021q.value == 1) && (form.disp_wan_8021q.value==1)){
                if(!form.wan_dot1q[0].selected){
                        wanVidOper(0);//disabled vlan id controls
                }
        }
}
function wan8021PCheck(){
        var value;
                 
        if(document.Alpha_WAN.wan_dot1pRemark.selectedIndex==1)
                value = true;
        else
                value = false;

        if (document.Alpha_WAN.isdot1pSupport.value == "Yes")
                document.Alpha_WAN.wan_dot1p.disabled=value;
}
function dochange8021q()
{
if(document.Alpha_WAN.wan_dot1q[0].selected)
        {
        wanVidOper(1);
        }
else if(document.Alpha_WAN.wan_dot1q[1].selected)
        {
        wanVidOper(0);
        }

}

function doLoad() {

        //var value = document.Alpha_WAN.wanTypeRadio[2].selected;
                //modify wanTypeRadio selectedindex 2->0
        var value = document.Alpha_WAN.wanTypeRadio[0].selected;

        if (value)
                pppStaticCheck();
                wanDNSCheck();

        if(document.Alpha_WAN.wan_PPPDomain != null && document.Alpha_WAN.wan_CompanyName != null){
                splitPPPUsername();
                var     companylistindex = document.Alpha_WAN.wan_PPPDomain.selectedIndex;
                if(companylistindex == 0)
                {
                        document.Alpha_WAN.wan_CompanyName.style.display = "none";
                        document.Alpha_WAN.wan_PPPDomain.style.width = "70px";
                        document.getElementById("IFrame1").style.display = "none";
                }
        else
        {
                document.Alpha_WAN.wan_CompanyName.style.display = "";
                document.Alpha_WAN.wan_PPPDomain.style.width = "119px";
                document.getElementById("IFrame1").style.display = "";
        }
        }
        document.Alpha_WAN.hidEncapFlag.value = "0";
        doConTypeChange();

        value = document.Alpha_WAN.is8021xsupport.value;
        if (value == 1) {
            doauthenticationChange();
            //doStatusChange(); 
        }

        value = document.Alpha_WAN.isDSLITESupported.value;
/*
        if(value == 1){
        //if(document.Alpha_WAN.ipVerRadio[2].selected && (document.Alpha_WAN.wanTypeRadio[0].selected || document.Alpha_WAN.wanTypeRadio[2].selected)){
                //modify wanTypeRadio selectedindex 2->0 ,0->2 delete(document.Alpha_WAN.wanTypeRadio[2].selected)
        if(document.Alpha_WAN.ipVerRadio[2].selected && (document.Alpha_WAN.wanTypeRadio[0].selected)){
                if(document.Alpha_WAN.WAN_DefaultRoute0[1].checked || (document.Alpha_WAN.WAN_DefaultRoute2[1].checked)){
                        doDefaultRouteNo();
                }
                else{
                        if((document.Alpha_WAN.DSLITEEnableRadio0[0].checked) || (document.Alpha_WAN.DSLITEEnableRadio2[0].checked)){
                                if((document.Alpha_WAN.DSLITEModeRadio0[0].checked) || (document.Alpha_WAN.DSLITEModeRadio2[0].checked)){
                                        doDSLiteModeAuto();
                                }
                                else if((document.Alpha_WAN.DSLITEModeRadio0[1].checked) || (document.Alpha_WAN.DSLITEModeRadio2[1].checked)){
                                        doDSLiteModeManual();
                                }
                        }
                }
        }
        }
*/
        if(document.Alpha_WAN.wan_PPPPassword != null)
                document.Alpha_WAN.wan_PPPPassword.value = pppPwd;

        

        document.getElementById("wan_TCPMTU0").style.display = "none";
        document.getElementById("wan_TCPMTU1").style.display = "none";
        //document.getElementById("wan_TCPMTU2").style.display = "none";
}

function doDelete() {
        document.Alpha_WAN.wanVCFlag.value = 2;
    document.Alpha_WAN.submit();
}
function doPrivacyaddrsShow0() 
{
        if(document.Alpha_WAN.DynIPv6EnableRadio[0].checked)
                setDisplay('div_privacyaddrs0',0);
        else
                setDisplay('div_privacyaddrs0',1);
}
function doPrivacyaddrsShow2()
{
        if(document.Alpha_WAN.PPPIPv6ModeRadio[0].checked)
                setDisplay('div_privacyaddrs2',0);
        else
                setDisplay('div_privacyaddrs2',1);
}

function ripngEnableChanged0() 
{
        if(document.Alpha_WAN.ripngEnableRadio0[0].checked)
                setDisplay('div_ripng_direction0', 1);
        else
                setDisplay('div_ripng_direction0', 0);
}
function ripngEnableChanged1() 
{
        if(document.Alpha_WAN.ripngEnableRadio1[0].checked)
                setDisplay('div_ripng_direction1', 1);
        else
                setDisplay('div_ripng_direction1', 0);
}

function ripngEnableChanged2() 
{
        if(document.Alpha_WAN.ripngEnableRadio2[0].checked)
                setDisplay('div_ripng_direction2', 1);
        else
                setDisplay('div_ripng_direction2', 0);
}

//add for nat warning information
        function doNATactive()
        {
                if(document.Alpha_WAN.wan_NAT[0].checked)
                        setDisplay('nat_warning_information', 0);
                else
                        setDisplay('nat_warning_information', 1);
        }
//add for nat warning information

</script>

<body onLoad="doLoad()" style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/home_wan.asp" name="Alpha_WAN">

<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        
        <INPUT TYPE="HIDDEN" NAME="hidEncapFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="hidEncap" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="disLanDHCP" VALUE="0"><!-- add to disable LAN dhcp when chose bridge mode -->
    <INPUT TYPE="HIDDEN" NAME="enableLanDHCP" VALUE="1"><!-- add to enable LAN dhcp when chose pppoe mode -->
    <INPUT TYPE="HIDDEN" NAME="ipVerRadio" VALUE="IPv4/IPv6">
    <INPUT type="HIDDEN" NAME="isIPv6Supported" value="1">

        <INPUT type="HIDDEN" NAME="DynIPv6Enable_flag" value="N/A">

        <INPUT TYPE="HIDDEN" NAME="PPPDHCPv6Enable_Flag" VALUE="N/A" >
        <INPUT TYPE="HIDDEN" NAME="PPPDHCPv6Mode_Flag" VALUE='0' >
        <INPUT TYPE="HIDDEN" NAME="IPv6PD_Flag" VALUE="Yes" >

        <INPUT TYPE="HIDDEN" NAME="DHCP6SMode_Flag" VALUE="0" >
        <INPUT TYPE="HIDDEN" NAME="IPVERSION_IPv4" VALUE="IPv4" >
        <INPUT TYPE="HIDDEN" NAME="wanTransFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="wanBarrierFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="ptm_VC" VALUE="8">
        <INPUT TYPE="HIDDEN" NAME="wanVCFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="service_num_flag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="wanSaveFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="vciCheckFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="wanEncapFlag" VALUE="0">
        <INPUT TYPE="HIDDEN" NAME="DSLITE_MANUAL_MODE" VALUE="1" >
        <INPUT TYPE="HIDDEN" NAME="IPVersion_Flag" VALUE="0" >
        <INPUT type="HIDDEN" NAME="is8021xsupport" value="0">
        <INPUT type="HIDDEN" NAME="isDSLITESupported" value="0">
        <INPUT type="HIDDEN" NAME="wan_8021q" value="1" >
        <INPUT type="HIDDEN" NAME="disp_wan_8021q" value="1" >

        <INPUT TYPE="HIDDEN" NAME="DefaultWan_Active" VALUE="No" >
        
        


        <INPUT TYPE="HIDDEN" NAME="DefaultWan_ISP" VALUE="3" >
        
        <INPUT TYPE="HIDDEN" NAME="DefaultWan_IPVERSION" VALUE="IPv4" >
        <INPUT TYPE="HIDDEN" NAME="DefaultWan_MLDproxy" VALUE="N/A" >
        <INPUT TYPE="hidden" NAME="ipv6SupportValue" VALUE="0">
        <input type="hidden" name="UserMode" value="0">
        <INPUT TYPE="HIDDEN" NAME="wan_certificate" value="N/A">
        <INPUT TYPE="HIDDEN" NAME="wan_CA" value="N/A">
        <INPUT TYPE="HIDDEN" NAME="wan_HiddenBiDirectionalAuth" value="N/A" >
        <INPUT TYPE="HIDDEN" NAME="IPv6PrivacyAddrsSupportedFlag" value="N/A" >
		<INPUT TYPE="HIDDEN" NAME="constantValueYes" VALUE="Yes">

        <tr height="25px" style="width:100%;background:#e6e6e6;">    
<td align=left class="title-main" style="width:250px;padding-left:20px;"> Set WAN Information  </td>
        </tr>

<tr style="height:30px;display:none;">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">Transfer Modes</td>
<td align=left class="tabdata">
                <SELECT NAME="wan_TransMode" SIZE="1" onChange="doTransChange()">

        
        
        
        
                        <option value="Fiber" selected>Fiber
        
                </SELECT></td>
        </tr>

<!--end  tcWebApi_get(...haveXPON...) <> "yes" -->
 <!--end  tcWebApi_get(...noWanModeDefined...) <> "yes" -->


        <tr style="display:none;">
                <td width="150" height="30" ></td>
                <td width="10" >&nbsp;</td>
        
                <td width="150" class="title-main1">  GPON </td>
                <td width="10" > </td>
                <td width="440"> </td>
        
        </tr>
        <tr style="display:none;" height="30px">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                WAN</td>
        <td align=left lass="tabdata">
                        <SELECT NAME="wan_VC" SIZE="1" onChange="doVCChange()" style="width: 50px;">
                                <OPTION value="0" selected>0
                                <!-- only use one wan port 
                                <OPTION value="1" >1
                                <OPTION value="2" >2
                                <OPTION value="3" >3
                                <!--
                                <OPTION value="4" >4
                                <OPTION value="5" >5
                                <OPTION value="6" >6
                                <OPTION value="7" >7
                                -->
                        </SELECT>&nbsp;
                        <INPUT TYPE="BUTTON" NAME="PVC_Summary" VALUE="WANs Summary" onClick="onClickPVCSummary();">
                        </td>
        </tr>
        <tr style="display:none;" height="30px">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
        Status</td>
        <td align=left lass="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_VCStatus" VALUE="Yes" onClick="doWanActiveYes()" checked >Enable 
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                        <INPUT TYPE="RADIO" NAME="wan_VCStatus" VALUE="No" onClick="doWanActiveNo()"  >Disable </td>
        </tr>
 <!-- TransMode<>"PON" end -->
</table>

<div id="div_isipv6sup">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;"> IP Version</td>
<td align=left class="tabdata">

        IPv4/IPv6


<!--
<select name="ipVerRadio" size="1" disabled=true onchange="doIPVersionChangeIPv4()">
<option value="IPv4" >IPv4 
<option value="IPv4/IPv6" selected>IPv4/IPv6 
<option value="IPv6" >IPv6 
</select>
-->
</td>
        </tr>
</table>
</div>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<!--
<tr height="30px" style="display:none">
<td width="250px" align=left class="tabdata" style="padding-left:20px;"> </td>
<td align=left class="tabdata"><INPUT TYPE="RADIO" NAME="wanTypeRadio" VALUE="0"  onClick="doConTypeChange(this)">  </td>
        </tr>
<tr height="30" style="display:none">
                <td class="light-orange">&nbsp;</td>
                <td class="light-orange"></td>
                <td class="tabdata">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wanTypeRadio" VALUE="1"  onClick="doConTypeChange(this)">  </td>
        </tr>

<tr height="30px">
<td width="250px" align=left class="tabdata" style="padding-left:20px;padding-top:10px;"> Connection Type</td>
<td align=left class="tabdata">
<INPUT TYPE="RADIO" NAME="wanTypeRadio" VALUE="2" checked onClick="doConTypeChange(this)">
PPPoE 
</td>
        </tr>
        <tr>
                <td class="light-orange">&nbsp;</td>
                <td class="light-orange"></td>
                <td class="tabdata">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wanTypeRadio" VALUE="3"  onClick="doConTypeChange(this)"> Bridge Mode 
-->

<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;"> Connection Type</td>
<td align=left class="tabdata">
<select size="1" name="wanTypeRadio" id="enable-isp" onchange="doConTypeChange(this)">
<!--modify selectesindex:dhcp(0),static ip(1),pppoe(2),bridge mode(3) topppoe(0),bridge mode(1) ,dhcp(2),static ip(3)-->
<option value="2" selected>

PPPoE

<!--<option value="3" >Bridge Mode
<option value="0"  > 
<option value="1"  > 
-->
</select>
</td>
        </tr>
</table>

<div id="div_8021q">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
        <TR height="30px">
        <TD align=left class="tabdata" style="width:250px;padding-left:20px;">802.1q </TD>
        <TD  align=left class="tabdata">
 <!--   
<INPUT value="Yes" type=radio name=wan_dot1q onclick="wanVidOper(1)"  > Tag 
 <INPUT value="No" type=radio name=wan_dot1q onclick="wanVidOper(0)" checked >Untag 

                        
-->

<select size="1" name="wan_dot1q" onchange="dochange8021q();">
<option value="Yes" >Tag 
<option value="No" selected>Untag 


</select>
</TD>
</TR>




        <TR height="30px">
        <TD width="250px" align=left class="tabdata" style="padding-left:20px;"> VLAN ID</TD>
        <TD align=left class="tabdata"><INPUT maxLength=5 size=5 name="wan_vid" VALUE="0" > (range: 0~4095) </TD>
        </TR>





</table>
</div>


<div id="div_mvlan">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
        <TR height="30px">
                <TD align=left class="tabdata" style="width:250px;padding-left:20px;"> Multi VLan Option</TD>
                <TD align=left class="tabdata"><INPUT maxLength=5 size=5 name="wan_mvlan" VALUE="-1" > (range: -1~4095, -1 means no multi vlan) </TD>
        </TR>
</table>
</div>


<!--  add nat on internet page -->
<div id="ipv4_nat">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
  <tr height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"> NAT Status</td>
                <td align=left class="tabdata">
           <input name="wan_NAT" type="radio" value="Enable" checked onClick="doNATactive()">
                         Enable&nbsp;&nbsp;&nbsp;&nbsp;
          <input name="wan_NAT" type="radio" value="Disabled"   onClick="doNATactive()">    
                 Disable
                </td>
  </tr>

  <tr height="30px" id="nat_warning_information" style="display:none">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"></td>
        <td align=left class="tabdata">
                <div style="color:#FF0000;">
                        warning:NAT is disabled
                </div>
        </td>
  </tr>
  
</table>
</div>
<!-- add end-->
</div>

<div id="div_802_1x">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
     <tr><td colspan="5" height="10">&nbsp;</td></tr>
     
        <tr>
                <td width="150" height="30" ></td>
                <td width="10" >&nbsp;</td>
                <td width="150" class="title-main1">  802.1X </td>
                <td width= "10"> </td>
                <td width="440"> </td>
        </tr>

<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
802.1X Authentication </td>
        </tr>

<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
    802.1X</td>
    <td align=left class="tabdata">
        <SELECT NAME="wan_status" SIZE="1" onchange="doStatusChange()">
                <option value="Disabled" >Disable
                <option value="Enable" >Enable
                </SELECT>
                </td>
                </tr>
<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
EAP Identity </td>
   <td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="wan_eapIdentity" SIZE="20" MAXLENGTH="45" VALUE="" >              
     </td></tr>
     
<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                EAP Method</td>
   <td align=left class="tabdata">
    EAP-TLS </td>
    </tr>
    
<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
     <INPUT type="checkbox" NAME="wan_authentication" onclick="doauthenticationChange()" checked></td>
        <td class="tabdata">
        Enable Bidirectional Authentication</td>
        </tr>

<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
    Certificate</td>
   <td align=left class="tabdata">
    <iframe src="/cgi-bin/getCertNames.cgi" name="Iframe2" frameBorder="0" height="22" scrolling="no" marginheight="0" align="top"></iframe>
                </td>
                </tr>

<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
    Trusted CA</td>
   <td align=left class="tabdata">
    <iframe src="/cgi-bin/getCANames.cgi" name="Iframe3" frameBorder="0" height="22" scrolling="no" marginheight="0" align="top"></iframe>
       
                </td>
                </tr>
   </table>
   </div>
 
 
<div id="div_isp0" style="display:none;">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
     <tr><td colspan="5" height="10">&nbsp;</td></tr>
        <tr>

                <td width="150" > </td>
                <td width="10"> </td>
                <td width="150" height="30" class="title-main">Dynamic IP</td><!-- modify title-main-right to title-main-->
                <td width="10" ></td>
                <td width="440"> </td>
        </tr>

        <tr>
                <td></td>
                <td></td>
                <td class="title-sub"> IP Common Options </td>
                <td class="light-orange">&nbsp;</td>
                <td></td>
        </tr>


        
        <tr id="div_isp0encap">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Bridge Interface</td>
   <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_BridgeInterface0" VALUE="Yes"  > Enable         
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_BridgeInterface0" VALUE="No"  checked > Disable </td>
        </tr>
        

        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Default Route</td>
   <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="WAN_DefaultRoute0" VALUE="Yes" onClick="doDefaultRouteYes()" checked > Enable  
                        &nbsp;&nbsp;&nbsp;&nbsp;<input type="RADIO" name="WAN_DefaultRoute0" value="No"  onClick="doDefaultRouteNo()"  > Disable </td>
        </tr>

        <tr id="wan_TCPMTU0">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                TCP MTU Option</td>
                <td class="tabdata">
                TCP MTU(0:default) 
                        <INPUT TYPE="TEXT" NAME="wan_TCPMTU0" SIZE="5" MAXLENGTH="4" VALUE=0 > bytes </td>
        </tr>
  

<!--ipv4/ipv6 and ipv4 dgk wait modify -->
        <tr id="div_ipv4nat_0">
                <td></td>
                <td></td>
                <td class="title-sub"> IPv4 Options </td>
                <td class="light-orange">&nbsp;</td>
                <td></td>
        </tr>
        <tr id="div_ipv4nat_1">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
NAT</td>
                <td width="440" class="tabdata">
                        <SELECT NAME="wan_NAT0" SIZE="1">
                                <option value="Enable" selected>Enable
                                <option value="Disabled" >Disable
                        </SELECT></td>
        </tr>

</table>

<!--ipv4/ipv6 and ipv4 dgk wait modify -->
<div id="div_ipv4IP">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
        Dynamic Route</td>
                <td width="440" class="tabdata">
                        <SELECT NAME="wan_RIP0" SIZE="1" >
                                <option value="RIP1" selected>RIP1
                                <option value="RIP2" >RIP2
                        </SELECT>
                         Direction 
                        <SELECT NAME="wan_RIP_Dir0" SIZE="1" >
                                <option value="None" selected>None
                                <option value="Both" >Both
                                <option value="IN Only" >IN Only
                                <option value="OUT Only" >OUT Only
                        </SELECT></td>
        </tr>

        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IGMP Proxy</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_IGMP0" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_IGMP0" VALUE="No"   >  Disable </td>
        </tr>

</table>
</div> 


<!-- ipv4/ipv6 deleted-->

<!--ipv4/ipv6 dgk wait modify -->

<div id="div_ipv6dhcp">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
     <tr><td colspan="5" height="10">&nbsp;</td></tr>
     
        <tr>
                <td width="150" height="30"></td>
                <td width="10" >&nbsp;</td>
                <td width="150"  class="title-main1">  IPv6 Address </td>
                <td width="10"> </td>
                <td width="440"> </td>
        </tr>
        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IPv6 Message Fetch Type</td>
                <td class="tabdata">
                Dynamic Mode  </td>
        </tr>
         
         <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                DHCP IPv6 Enable</td>
                <td class="tabdata">
                        
                        <INPUT TYPE="RADIO" NAME="DynIPv6EnableRadio" VALUE="1" checked >  DHCP 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="DynIPv6EnableRadio" VALUE="0"  >  SLAAC         
                        
                </td>
        </tr>
        
        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                DHCP PD Enable </td>
                <td class="tabdata">                         
                        <INPUT TYPE="RADIO" NAME="PPPIPv6PDRadio0" VALUE="Yes" onClick="doPPPv6PDEnable()" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="PPPIPv6PDRadio0" VALUE="No" onClick="doPPPv6PDDisable()"  >  Disable    
                </td>
        </tr>

                <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                MLD Proxy</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_MLD0" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_MLD0" VALUE="No"   >  Disable </td>
        </tr>


</table>
</div>

        <div id="div_isp0dsl">
        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td width="150" class="title-sub"> Dual Stack Lite </td>
                <td width="10" class="light-orange">&nbsp;</td>
                <td width="440"></td>
        </tr>
        <tr>
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Enable</td>
                <td class="tabdata">
                <input type="RADIO" name="DSLITEEnableRadio0" value="Yes" onClick="doDSLiteEnable(0)"  >
           Enable  
          <INPUT TYPE="RADIO" NAME="DSLITEEnableRadio0" VALUE="No" onClick="doDSLiteDisable(0)" checked >
           Disable  </td>
        </tr>
        <tr id="div_dslite0_0">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Mode</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="DSLITEModeRadio0" VALUE="0"  onClick="doDSLiteModeAuto()" checked >
           Auto  <input type="RADIO" name="DSLITEModeRadio0" value="1"   onClick="doDSLiteModeManual()"  >
           Manual </td>
        </tr>
        <tr id="div_dslite0_1">
<td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Remote IPv6 Address</td>
                <td class="tabdata"><INPUT TYPE="TEXT" NAME="DSLITEAddr0" SIZE="39" MAXLENGTH="39" VALUE= N/A >
                <script language="JavaScript" type="text/JavaScript">
                if (document.Alpha_WAN.isDSLITESupported.value == "1"){
                        if(document.Alpha_WAN.DSLITEEnableRadio0[0].checked)
                                doDSLiteEnable(0);
                        else
                                doDSLiteDisable(0);
                }
                </script></td>
        </tr>
        </table>
</div>
</div>

<div id="div_isp1" style="display:none;">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
     <tr><td colspan="5" height="10">&nbsp;</td></tr>
     
        <tr>
                <td width="150">   </td>
                <td width="10"> </td>
                <td width="150" height="30"  class="title-main">Static IP</td>
                <td width="10" ></td>
                <td width="440"> </td>
        </tr>
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td class="title-sub"> IP Common Options </td>
                <td class="light-orange">&nbsp;</td>
                <td></td>
        </tr>



        
        <tr id="div_isp1encap">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Bridge Interface </td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_BridgeInterface1" VALUE="Yes"  > Enable         
                        <INPUT TYPE="RADIO" NAME="wan_BridgeInterface1" VALUE="No"  checked > Disable </td>
        </tr>
        
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Default Route</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="WAN_DefaultRoute1" VALUE="Yes"  onClick="doDefaultRouteYes()" checked > Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="WAN_DefaultRoute1" VALUE="No"   onClick="doDefaultRouteNo()"  > Disable </td>
        </tr>

        <tr id ="wan_TCPMTU1" >
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                TCP MTU Option</td>
                <td class="tabdata"> TCP MTU(0:default) 
                        <INPUT TYPE="TEXT" NAME="wan_TCPMTU1" SIZE="5" MAXLENGTH="4" VALUE=0 > bytes </td>
        </tr>

</table>

<div id="div_ipv4static">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td class="title-sub"> IPv4 Options </td>
                <td class="light-orange">&nbsp;</td>
                <td></td>
        </tr>


        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
        Static IP Address</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIPaddr1" SIZE="16" MAXLENGTH="15" VALUE=  ></td>
        </tr>

        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IP Subnet Mask</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIPSubMask1" SIZE="16" MAXLENGTH="15" VALUE= ></td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Gateway</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIpGateway1" SIZE="16" MAXLENGTH="15" VALUE= ></td>
        </tr>
        
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                NAT</td>
                <td width="440" class="tabdata">
                <select name="wan_NAT1" size="1">
                <option value="Enable" selected>Enable 
                <option value="Disabled" >Disable 
        </select></td>
        </tr>


        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Dynamic Route</td>
                <td class="tabdata">
                        <SELECT NAME="wan_RIP1" SIZE="1" >
                                <option value="RIP1" selected>RIP1
                                <option value="RIP2" >RIP2
                        </SELECT>
                         Direction 
                        <SELECT NAME="wan_RIP_Dir1" SIZE="1" >
                                <option value="None" selected>None
                                <option value="Both" >Both
                                <option value="IN Only" >IN Only
                                <option value="OUT Only" >OUT Only
                        </SELECT></td>
        </tr>
</table>
</div>


<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr id="div_ipv4igp">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IGMP Proxy</td>
                <td width="440" class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_IGMP1" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_IGMP1" VALUE="No"   >  Disable </td>
        </tr>
</table>



<div id="div_ipv6_staticip">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td width="150" class="title-sub"> IPv6 Options </td>
                <td width="10" class="light-orange">&nbsp;</td>
                <td width="440"></td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IPv6 Message Fetch Type</td>
                <td class="tabdata"> Static Mode  </td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IPv6 Address </td>
                <td class="tabdata">
                <INPUT TYPE="TEXT" NAME="wan_IPv6Addr" SIZE="39" MAXLENGTH="39" VALUE=""><font size=+1>&nbsp;/&nbsp; <INPUT TYPE="TEXT" NAME="wan_IPv6Prefix" SIZE="3" MAXLENGTH="3" VALUE=""></font></td>
     </tr>
         <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     IPv6 Default Gateway </td>
     <td class="tabdata">
        <INPUT TYPE="TEXT" NAME="wan_IPv6DefGw" SIZE="39" MAXLENGTH="39" VALUE=""></td>
     </tr>
         
         <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     IPv6 DNS Server1</td>
     <td class="tabdata">
        <INPUT TYPE="TEXT" NAME="wan_IPv6DNS1" SIZE="39" MAXLENGTH="39" VALUE=""></td>
     </tr>
         
         <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     IPv6 DNS Server2 </td>
     <td class="tabdata">
        <INPUT TYPE="TEXT" NAME="wan_IPv6DNS2" SIZE="39" MAXLENGTH="39" VALUE=""></td>
     </tr>
 
         <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                MLD Proxy</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_MLD1" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_MLD1" VALUE="No"   >  Disable </td>
        </tr>


        </table>
        </div>

        <div id="div_isp1dsl">
        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td width="150" class="title-sub"> Dual Stack Lite </td>
                <td width="10" class="light-orange">&nbsp;</td>
                <td width="440"></td>
        </tr>

        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
        Enable</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="DSLITEEnableRadio1" VALUE="Yes" onClick="doDSLiteEnable(1)"  >
           Enable  
                &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="DSLITEEnableRadio1" VALUE="No" onClick="doDSLiteDisable(1)" checked >
           Disable  </td>
        </tr>
        <tr  id="div_dslite1_0">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Mode</td>
                <td class="tabdata"> 
           Manual </td>
        </tr>

        <tr id="div_dslite1_1">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Remote Address</td>
                <td class="tabdata"><INPUT TYPE="TEXT" NAME="DSLITEAddr1" SIZE="39" MAXLENGTH="39" VALUE=  >
                <script language="JavaScript" type="text/JavaScript">
                if (document.Alpha_WAN.isDSLITESupported.value == "1"){
                        if(document.Alpha_WAN.DSLITEEnableRadio1[0].checked)
                                doDSLiteEnable(1);
                        else
                                doDSLiteDisable(1);
                }
                </script></td>
        </tr>
        </table>
</div>
</div>
 

<div id="div_isp2">        
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">    
        <td align=left class="title-main" style="width:250px;padding-left:20px;" >
        Set PPPoE Information
        </td>
        </tr>
</table>
     
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
<tr height="30px">
<td align=left class="tabdata" style="width:250px;padding-left:20px;"> PPPoE Username</td>
<td align=left class="tabdata">
                <TABLE cellSpacing=0 cellPadding=0 align=left border=0>
                <TBODY>
                <TR>
                  
                        <INPUT TYPE="TEXT" NAME="wan_PPPUsername" SIZE="32" MAXLENGTH="64" VALUE="fpt" >
                  
                  <input type="HIDDEN" name="TTNETGuiSupport" value=0>
                  </TD></TR></TBODY></TABLE>
</td>
      </tr>

        <tr id=PPPUsername_ErrorMsg_TR style="DISPLAY: none">
                <td class="light-orange">&nbsp;</td>
                <td class="light-orange">&nbsp;</td>
                <td class="tabdata">&nbsp;</td>
                <td class="tabdata">&nbsp;</td>
                <td class="tabdata"><FONT color=#ff0000>The domain name is invalid. Please check!</font></td>
        </tr>

<tr height="30px">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> PPPoE Password</td>
                <td align=left class="tabdata" style="width:370px;">
                <INPUT TYPE="PASSWORD" NAME="wan_PPPPassword" SIZE="32" MAXLENGTH="30" VALUE="fpt" ></td>
        </tr>



        
        <tr style="display:none"><!-- hide this for bridge interface must be active otherwise IPTV can't play on FPT lab -->
        <!--<tr id="div_isp2encap">-->
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Bridge Interface</td>
                <td class="tabdata">
                        <input type="RADIO" name="wan_BridgeInterface2" value="Yes"  > Enable  
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_BridgeInterface2" VALUE="No"  checked > Disable </td>
        </tr>
        

<tr height="30px">
<td width="250px" align=left class="tabdata" style="padding-left:20px;">PPPoE Connection Mode</td>
<td align=left class="tabdata" style="width:370px;">
<!--
<INPUT TYPE="RADIO" NAME="wan_ConnectSelect" VALUE="Connect_Keep_Alive" 
checked onClick="WANChkIdleTimeT();"> Always On 
-->

<select name="wan_ConnectSelect" size="1" onchange="WANChkIdleTimeT();">
<option value="Connect_Keep_Alive" selected>Always On 
<!--
<option value="Connect_on_Demand"  id="connondemand_info" >Connect On-Demand (Close if idle for 
-->
<option value="Connect_Manually" >Connect Manually 
</select>
</td>
        </tr>

        <tr height="30px" style="display:none;">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> PPPoE Relay</td>
                <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="pppoe_relay" VALUE="Yes"  >  Enable&nbsp;&nbsp;&nbsp;&nbsp;
                        <INPUT TYPE="RADIO" NAME="pppoe_relay" VALUE="No"  checked >  Disable
                </td>
        </tr>

<!--
        <tr id="connondemand_info">
                <td class="light-orange">&nbsp;</td>
                <td class="light-orange"></td>
                <td class="tabdata">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_ConnectSelect" VALUE="Connect_on_Demand"    onClick="WANChkIdleTimeT();"> Connect On-Demand (Close if idle for         
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="TEXT" NAME="wan_IdleTimeT" SIZE="5" MAXLENGTH="3" VALUE=0 > minutes) </td>
        </tr>
-->
<tr style="display:none">
<td width="250px" align=left class="tabdata" style="padding-left:20px;">&nbsp;</td>
<td align=left class="tabdata" style="width:370px;">
<INPUT TYPE="TEXT" NAME="wan_IdleTimeT" SIZE="5" MAXLENGTH="3" VALUE=0 > minutes) 
</td>
</tr>
<!--
        <tr>
                <td class="light-orange">&nbsp;</td>
                <td class="light-orange"></td>
                <td class="tabdata">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_ConnectSelect" VALUE="Connect_Manually"   onClick="WANChkIdleTimeT();"> Connect Manually </td>
        </tr>
-->
        
<tr height="30px" style="display:none;">
<td width="250px" align=left class="tabdata" style="padding-left:20px;"> TCP MSS Option</td>
<td align=left class="tabdata" style="width:370px;"> 
<INPUT TYPE="TEXT" NAME="wan_TCPMSS" SIZE="5" MAXLENGTH="4" VALUE=0 >
bytes&nbsp;&nbsp;(0 means use default) </td>
        </tr>
        
</table>

<div id="PPP_MTU">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
        <tr height="30px" id ="wan_TCPMTU2">
                <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                        TCP MTU Option </td>
                <td class="tabdata"> 
                        <INPUT TYPE="TEXT" NAME="wan_TCPMTU2" SIZE="5" MAXLENGTH="4" VALUE=0 > bytes (0 means use default:1500) </td>
        </tr>
</table>
</div>
</div><!--id="block1"-->

<!-- add IPTV on/off switch-->

<div id="block1" class="main_item" style="display:none;">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">

        <tr height="25px" style="width:100%;background:#e6e6e6;">    
                <td align=left class="title-main" style="width:250px;padding-left:20px;"> Set IPTV State </td>
        </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
        <tr  id="ipv4_iptv" height="30px">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> IPTV State</td>
                <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_IPTV" VALUE="Yes" checked >  Enable&nbsp;&nbsp;&nbsp;&nbsp;
                        <INPUT TYPE="RADIO" NAME="wan_IPTV" VALUE="No"   >  Disable
                </td>
        </tr>
        <!-- add IPv6 IPTV state -->
<!--    <tr id="ipv6_iptv" height="30px">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> IPv6 IPTV State</td>
                <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_ipv6_IPTV" VALUE="Yes" checked >  Enable&nbsp;&nbsp;&nbsp;&nbsp;
                        <INPUT TYPE="RADIO" NAME="wan_ipv6_IPTV" VALUE="No"   >  Disable
                </td>
        </tr> -->
        <!--end-->
</table>
</div><!-- end id="block1"-->

<!-- IPTV on/off switch end-->

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="display:none;">
        <tr>
                <td width="150" height="30"> </td>
                <td width="150" colspan="2" class="title-main"> IP Options </td>
                <td width="10"></td>
                <td width="440"></td>
        </tr>

        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td class="title-sub" width="150"> IP Common Options </td>
                <td  width="10">&nbsp;</td>
                <td width="440"></td>
        </tr>

        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Default Route</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="WAN_DefaultRoute2" VALUE="Yes"  onClick="doDefaultRouteYes()" checked > Enable         
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <INPUT TYPE="RADIO" NAME="WAN_DefaultRoute2" VALUE="No"   onClick="doDefaultRouteNo()"  > Disable </td>
        </tr>
</table>

<!--ipv4 and ipv4/v6 dgk wait modify -->
<div id="div_ipv4getip">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="display:none;">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td class="title-sub"> IPv4 Options </td>
                <td class="light-orange">&nbsp;</td>
                <td></td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Get IP Address</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_PPPGetIP" VALUE="Static"   onClick="pppStaticCheck()"> Static 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_PPPGetIP" VALUE="Dynamic" checked onClick="pppStaticCheck()"> Dynamic </td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Static IP Address</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIPaddr2" SIZE="16" MAXLENGTH="15" VALUE=  ></td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IP Subnet Mask</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIPSubMask2" SIZE="16" MAXLENGTH="15" VALUE= ></td>
        </tr>
        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Gateway</td>
                <td class="tabdata">
                        <INPUT TYPE="TEXT" NAME="wan_StaticIpGateway2" SIZE="16" MAXLENGTH="15" VALUE= ></td>
        </tr>
          <tr id="set_wandns0">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     DNS Mode </td>
     <td class="tabdata">
            <INPUT TYPE="RADIO" NAME="dnsTypeRadio" VALUE="0" onClick="autoDNSRelay()" checked > Automatically 
            &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="dnsTypeRadio" VALUE="1" onClick="manualDNSRelay()"  > Manually 
     </td></tr>
     
     <tr id="set_wandns1">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     Primary DNS</td>
     <td class="tabdata">
        <INPUT TYPE="TEXT" NAME="PrimaryDns" SIZE="15" MAXLENGTH="15" VALUE="N/A" >             
     </td></tr>

     <tr id="set_wandns2">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
     Secondary DNS </td>
     <td class="tabdata">
        <INPUT TYPE="TEXT" NAME="SecondDns" SIZE="15" MAXLENGTH="15" VALUE="N/A" >            
     </td></tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="display:none;">
<!--    <tr height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"> NAT</td>
        <td align=left class="tabdata">
                        <SELECT NAME="wan_NAT2" SIZE="1">
                                <option value="Enable" selected>Enable
                                <option value="Disabled" >Disable
                        </SELECT></td>
        </tr>   delete it-->

        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Dynamic Route</td>
                <td class="tabdata">
                        <SELECT NAME="wan_RIP2" SIZE="1" >
                                <option value="RIP1" selected>RIP1
                                <option value="RIP2" >RIP2
                        </SELECT>
                         Direction 
                        <SELECT NAME="wan_RIP_Dir2" SIZE="1" >
                                <option value="None" selected>None
                                <option value="Both" >Both
                                <option value="IN Only" >IN Only
                                <option value="OUT Only" >OUT Only
                        </SELECT></td>
        </tr>


        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                IGMP Proxy </td>
                <td width="440" class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_IGMP2" VALUE="Yes" checked >  Enable         
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_IGMP2" VALUE="No"   >  Disable </td>
        </tr>

        </table>
        </div>

<!--add Extension Mechanisms for DNS(EDNS) function-->
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">    
                <td align=left class="title-main" style="width:250px;padding-left:20px;"> Extension Mechanisms for DNS(EDNS) </td>
        </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
        <tr height="30px">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> Add Client Mac Option</td>
                <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="EDNSMode" VALUE="Yes"  >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="EDNSMode" VALUE="No" checked >  Disable         
                </td>
        </tr>
</table>
</div>
<!--add Extension Mechanisms for DNS(EDNS) function-->

<!-- ipv4 and ipv6 dgk wait modify-->
<div id="div_ipv6pdm">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">

        <tr height="25px" style="width:100%;background:#e6e6e6;">    
                <td align=left class="title-main" style="width:250px;padding-left:20px;"> IPv6 Options </td>
        </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
        <tr height="30px">
                <td width="250px" align=left class="tabdata" style="padding-left:20px;"> DHCP IPv6 Mode</td>
                <td align=left class="tabdata">
                        
                        <INPUT TYPE="RADIO" NAME="PPPIPv6ModeRadio" VALUE="1" onClick="doPPPv6ModeDHCP()"  >  DHCP 
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="PPPIPv6ModeRadio" VALUE="0" onClick="doPPPv6ModeSLAAC()" checked >  SLAAC         
                
                </td>
        </tr>

        

        <tr height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"> DHCP PD Enable</td>
        <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="PPPIPv6PDRadio2" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="PPPIPv6PDRadio2" VALUE="No"   >  Disable </td>
        </tr>


        <tr style="display:none" height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;">MLD Proxy</td>
        <td align=left class="tabdata">
                        <INPUT TYPE="RADIO" NAME="wan_MLD2" VALUE="Yes" checked >  Enable 
                        &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="wan_MLD2" VALUE="No"   >  Disable </td>
        </tr>




</table>
</div><!--id="block1" 12/13-->
</div><!--id="div_ipv6pdm"-->

        <div id="div_isp2dsl">
<div id="block1" class="main_item">
        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
                <td width="150"></td>
                <td width="10"></td>
                <td width="150" class="title-sub"> Dual Stack Lite </td>
                <td width="10" class="light-orange">&nbsp;</td>
                <td width="440"></td>
        </tr>

        <tr>
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Enable</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="DSLITEEnableRadio2" VALUE="Yes" onClick="doDSLiteEnable(2)"  >
           Enable  
                &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="DSLITEEnableRadio2" VALUE="No" onClick="doDSLiteDisable(2)" checked >
           Disable  </td>
        </tr>
        <tr  id="div_dslite2_0">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Mode</td>
                <td class="tabdata">
                        <INPUT TYPE="RADIO" NAME="DSLITEModeRadio2" VALUE="0"  onClick="doDSLiteModeAuto()" checked >
           Auto  
                <INPUT TYPE="RADIO" NAME="DSLITEModeRadio2" VALUE="1"   onClick="doDSLiteModeManual()"  >
           Manual </td>
        </tr>
        <tr id="div_dslite2_1">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                Remote Address</td>
                <td class="tabdata"><INPUT TYPE="TEXT" NAME="DSLITEAddr2" SIZE="39" MAXLENGTH="39" VALUE=  >
                <script language="JavaScript" type="text/JavaScript">
                if (document.Alpha_WAN.isDSLITESupported.value == "1"){
                        if(document.Alpha_WAN.DSLITEEnableRadio2[0].checked)
                                doDSLiteEnable(2);
                        else
                                doDSLiteDisable(2);
                }
                </script></td>
        </tr>
        </table>
</div><!--id="block1" 12/13-->
</div>

</div><!--id="div_isp2"-->

<div id="div_isp3">

</div>

<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
        <tr height="25px">
                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Save" to save your settings</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr height="40px">
                <INPUT TYPE="HIDDEN" NAME="isPPPAuthen" VALUE="N/A">
                <INPUT TYPE="HIDDEN" NAME="isWanTagChk" VALUE="N/A">
                <INPUT TYPE="HIDDEN" NAME="isdot1pSupport" VALUE="N/A">
                <INPUT TYPE="HIDDEN" NAME="isTPIDSupported" VALUE="N/A">

        <td width="250px" align=left class="tabdata" style="padding-left:20px;">
        <INPUT TYPE="button" NAME="SaveBtn" class="button1" VALUE="Save" onClick="uiSave()" >

        <INPUT TYPE="HIDDEN" NAME="DefaultDmz_Active" VALUE="No" >
        <INPUT TYPE="HIDDEN" NAME="DefaultDmz_HostIP" VALUE="0.0.0.0" >
        </td>

        <td id="firstDiv" style="float:left;"></td>

                <td width="160" class="orange">
                <script language="JavaScript" type="text/JavaScript">
                with (document.Alpha_WAN){
                        /*8021q check*/
                        setDisplay('div_8021q', 0);
                        if((wan_8021q.value == 1) && (disp_wan_8021q.value==1)){
                                setDisplay('div_8021q', 1);
                        }
                        
                        if (is8021xsupport.value != "1") {
                            setDisplay('div_802_1x', 0);
                        }
                        if(isIPv6Supported.value != "1"){
                                //ipVerRadio[0].selected = true; 
                                doIPVersionChangeIPv4();
                                setDisplay('div_isipv6sup', 0);
                        }
                        else{
                                doIPVersionChangeIPv4();
                        }
                        //vlan id check

                        wan8021QCheck();
                        WANChkIdleTimeT();
                }
                </script></td>
        </tr> 

</table>
</div>
</div><!--id="contenttype"-->
</div>

                
</form></body></html>
