//# sourceURL=zzxkYzbZy.js 
jQuery(function($){
	/***首页数据修改（开始）***/
	$("#xkxn").text($("#xkxnmc").val());
	$("#xkxq").text($("#xkxqmc").val());
	$("#txt_xklc").html("<font color='red'>"+$("#xklcmc").val()+"</font>");
	$("#yxxfs").text($("#zxfs").val());

	var syts = $("#syts").val();
	var syxs = $("#syxs").val();
	if($("#isinxksj").val()=="1"){
		if(syts > 1){
			$("#sysj").html("（<b><font size='3px'>"+$.i18n.prop("syjts", [syts])+"</font></b>）");
		}else{
			$("#sysj").html("（<b><font size='3px'>"+$.i18n.prop("syjxs", [syxs])+"</font></b>）");
		}
	}else{
		if(syts > 1){
			$("#sysj").html("（<b><font size='3px'>"+$.i18n.prop("jxkkssyts", [syts])+"</font></b>）");
		}else{
			$("#sysj").html("（<b><font size='3px'>"+$.i18n.prop("jxkkssyxss", [syxs])+"</font></b>）");
		}
	}
	if($("#xxdm").val()=="10295"){
		if($("#bxqzgxkxf").val()>0){
			$("#bxqbkkklxzgxf").html($.i18n.prop("bxqbkklxzgxf", [$("#bxqzgxkxf").val()]));
		}else{
			$("#bxqbkkklxzgxf").html("");
		}
		var bkklxyxxf=0;
		var kklxdm=$("#kklxdm").val();
		$(".right_div .list-group").each(function(idx,itm){
			if($(itm).data("kklxdm")==kklxdm){
				bkklxyxxf = bkklxyxxf+$(itm).find("input[name='right_xf']").val()*1;
			}
		});
		$("#bxqbkkklxyxxf").html(bkklxyxxf);
	}
	if(jQuery("#firstKklxdm").val()=="01" && $("#sfyjxk").val()=="1"){
		$("#quickXk").html("<button type='button' class='btn btn-primary btn-sm btn-quick' onclick='chooseCoursesQuickly()'>"+$.i18n.get("msg_yjxk")+"</button>");//一键选课
	}else if(jQuery("#kklxdm").val()=="10" && $("#xxdm").val()=="34234"){
		$("#quickXk").html("<button type='button' class='btn btn-primary btn-sm btn-quick' onclick='showXfyq()'>"+$.i18n.get("msg_xfyq")+"</button>");//通识学分要求
	}
	if($("#firstKklxdm").val()=="xyjsk"){
		$('#searchBox').trigger('searchResult');
	}
});



