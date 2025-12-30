
//得到硬盘序列号
function getDiskLicence(){
	var locator = new ActiveXObject ("WbemScripting.SWbemLocator");
	var service = locator.ConnectServer(".");
	var properties = service.ExecQuery("SELECT * FROM Win32_DiskDrive");
	var e = new Enumerator (properties);
	var diskLicence = "";
	document.write("<table border=1>");
	for (;!e.atEnd();e.moveNext ())
	{
		var p = e.item ();
		diskLicence += p.signature.toString();
	}
	return diskLicence
}