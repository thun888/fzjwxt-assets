

var flag=true;      //普通标记:true-可提醒,false-不提醒
var sUserAgent= navigator.userAgent.toLowerCase(); 
function setUserInfo(data){
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
          window.webkit.messageHandlers.sendUserInfo.postMessage(data);
       
      } else {
          window.android.sendUserInfo(data);
          
      }
}
jQuery(function($){	
	let xxdm = $("#xxdm1").val() || '00000';
	let jsdm = $("#jsdm").val() || '';// 角色代码
	// 绑定退出按钮
	$(document).off("click touchend", "#exit_btn").on("click touchend", "#exit_btn", function(e) {
		//window.location = _systemPath + "/xtgl/dl_logout.html?t=" + jQuery.now() + "&login_type=" + $("#login_type").val();
		//改为统一的shiro注销地址
		e.preventDefault();
		if(sUserAgent.indexOf('zfsoft')>-1){
			setUserInfo("");
		}
		window.location = _systemPath + "/logout?t=" + jQuery.now() + "&login_type=" + $("#login_type").val();
	})
	$(".wbxt").click(function(){            //外部系统的打开
		var form = jQuery("<form></form>");
		form.attr({
			"id"	: "funcForm",
			'action': $(this).attr("data"),
			'method': 'get',
			'target': '_blank'
		});
		form.appendTo("body").submit();
	});
	
	$('.dropdown-toggle2').click(function(){
		$(this).parent().toggleClass('open');
		$('.jw-shade').toggle(); 
	});
	
	$('.jw-shade,.dropdown-menu2 li:not(".dropdown-submenu"),.dropdown-submenu .dropdown-menu2').click(function(){
		$('.nav-phone').find('.open').removeClass('open');
		$('.jw-shade').hide();
	});
	$('.dropdown-submenu').click(function(){
		$(this).find('.dropdown-menu2').toggle();
	});
	
	//如果是按F5刷新，则把flag置为:false，这样就不用提醒了
	 $(document).bind("keydown",function(e){
	        e=window.event||e;
	        if(e.keyCode==116){
	        	flag=false;  
	        }
	     });
	
	//如果是进行角色切换，则把flag置为:false，这样就不用提醒了
	 $(document).bind("mousedown",function(e){
	        if($(e.target).is("a")){
		        var aHref = $(e.target).attr("href");
		        if(aHref!=null&&aHref.indexOf("xtgl/index_initMenu.html")>-1){
		        	flag=false;  
		        }
	        }
	     });
	if(!device.mobile()){
		if(navigator.userAgent.indexOf("Firefox")>-1){                  //判断是否火狐浏览器
			window.onunload=function(e){ 
				if(flag){        //flag为true，才刷新页面
					var evt = e ? e : (window.event ? window.event : null);  //此方法为了在firefox中的兼容  
					evt.returnValue='';                 //可添加内容：如果关闭页面，将需要重新登录系统
					return '';
				}
			}
		}
		else{
			$(window).bind('beforeunload',function(event){
					if(flag){        //flag为true，才刷新页面
						return '';                       //可添加内容：如果关闭页面，将需要重新登录系统
					}
				});
		}
	}

	// 重庆电力高等专科学校:检查教师是否有超过三天未提交申请的计划课程教材申请信息
	if('11848' == xxdm && 'js' == jsdm){
		new Promise(resolve=>{
		$.post(_path + '/xtgl/index_cxJsJhkcjcsqWtjNum.html',(data)=>{
			resolve(data);
		});
		}).then(data=>{
			if (data > 0) {
				$.confirm("您有" +data + "条超过三天没提交的计划教材申请信息，点击确定按钮可前往计划教材申请页面，取消则关闭提醒",function(result){
					if(result){
						openWin('../jczdgl/jhjczdsq_cxJhjczdsqIndex.html', {'gnmkdm': 'N757010', 'shzt':'0'}, true);
					}
				});
			}
		});
	}

	//湖北交通职业技术学院：应届毕业生和已毕业2年内的往届毕业生，公选课学分未修满提示
	if('12752' == xxdm && 'xs' == jsdm) {
		$.post(_path + "/xtgl/index_cxXsGxkxfwxm.html",{},function(data){
			if($.founded(data) && data.flag=="1"){
				$.showDialog(_path + '/query/query_cxFckContent.html','公选课学分未修满提醒',{
					modalName:"xfwxmmodal",
					width:"500px",
					data:{'content':data.msg},
					buttons:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								$.closeModal("xfwxmmodal");
								return false;
							}
						}
					}
				});
			}
		});
	}

 //角色切换	
 $("#jsqhUl").off("click","a").on("click","a",function(event){
	 event.preventDefault();
	 var jsdm = $(this).data("jsdm");
	 var tzlj = $(this).attr("href");
	 if($.founded(tzlj) && $.founded(jsdm)){
		 $.post(_path + "/xtgl/index_cxJssfqy.html",{jsdm:jsdm},function(data){
			 if(data=="1"){
				 window.location.href = tzlj;
			 }else{
				 $.alert("该角色不在使用时间内!");
			 }
		 }); 
	 }
 });	
	
 //设置默认角色	
 $("#jsmrUl").off("click","a").on("click","a",function(){
	 var dqjsdm = $(this).attr("dqjsdm");
	 $.post(_path + "/xtgl/index_cxSzmrjs.html?localeKey="+$("#localChange").val(),{dqjsdm:dqjsdm},function(data){
		 if(data.indexOf("成功")!=-1){
			 $.success(data);
			 $("#jsmrUl").find("a").each(function(){
				 if($(this).attr("dqjsdm") == dqjsdm){
					 if($(this).find("span").length<1){
						 $(this).append("<span class=\"glyphicon glyphicon-star-empty float_r\"></span>");
					 } 
				 }else{
					 $(this).find("span").remove();
				 }
			 });
		 }else if(data.indexOf("失败")!=-1){
			 $.error(data);
		 }else{
			 $.alert(data);
		 }
	 });
	 
 });
	
	
 	//选课时，学生角色登陆不加载首页面几个区域
	if($("#jsdm").val()=='xs' && $("#sfgbxssyxs").val()=='1'){
		
	}else{
	//页面全部加载完成之后，再执行以下方法
	//window.onload=function(e){ 
		// 加载第一块内容
		$("#area_one").load(_path + "/xtgl/index_cxAreaOne.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
	/*		$("#area_one").mCustomScrollbar({
				autoHideScrollbar	: false,
				autoExpandScrollbar	: false,
				horizontalScroll 	: false,
				scrollInertia	 	: 0,
				scrollButtons:{
					enable		: true,
					scrollType	: "continuous",
					scrollSpeed	: 20,
					scrollAmount: 40
				},
				advanced:{
				    updateOnBrowserResize: false,
				    updateOnContentResize: true,
				    updateOnSelectorChange: false,
				    autoExpandHorizontalScroll: true
				},
	 			theme:"dark-3"
			});
			$('#area_one').mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
			});*/
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
				$("#xskbcxgd").text("...More");
				$("#jskbcxgd").text("...More");
				}
		});
		
		// 加载第二块内容
		$("#area_two").load(_path + "/xtgl/index_cxAreaTwo.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
//			$("#area_two").mCustomScrollbar({
//				autoHideScrollbar	: false,
//				autoExpandScrollbar	: false,
//				horizontalScroll 	: false,
//				scrollInertia	 	: 0,
//				scrollButtons:{
//					enable		: true,
//					scrollType	: "continuous",
//					scrollSpeed	: 20,
//					scrollAmount: 40
//				},
//				advanced:{
//				    updateOnBrowserResize: true,
//				    updateOnContentResize: true,
//				    updateOnSelectorChange: false,
//				    autoExpandHorizontalScroll: true
//				},
//	 			theme:"dark-3"
//			});
//			$('#area_two').mousewheel(function(event, delta, deltaX, deltaY) {
//				event.preventDefault();
//			});
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
				$("#wjgd").text("...More");
			}
		});
		
		// 加载第三块内容
		$("#area_three").load(_path + "/xtgl/index_cxAreaThree.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
			/*$("#area_three").mCustomScrollbar({
				autoHideScrollbar	: false,
				autoExpandScrollbar	: false,
				horizontalScroll 	: false,
				scrollInertia	 	: 0,
				scrollButtons:{
					enable		: true,
					scrollType	: "continuous",
					scrollSpeed	: 20,
					scrollAmount: 40
				},
				advanced:{
				    updateOnBrowserResize: false,
				    updateOnContentResize: true,
				    updateOnSelectorChange: false,
				    autoExpandHorizontalScroll: true
				},
	 			theme:"dark-3"
			});
			$('#area_three').mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
			});*/
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
				$("#lj").text("...More");
			}
			
		});
		
		// 加载第四块内容
		$("#area_four").load(_path + "/xtgl/index_cxAreaFour.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
			/*$("#area_four").mCustomScrollbar({
				autoHideScrollbar	: false,
				autoExpandScrollbar	: false,
				horizontalScroll 	: false,
				scrollInertia	 	: 0,
				scrollButtons:{
					enable		: true,
					scrollType	: "continuous",
					scrollSpeed	: 20,
					scrollAmount: 40
				},
				advanced:{
				    updateOnBrowserResize: false,
				    updateOnContentResize: true,
				    updateOnSelectorChange: false,
				    autoExpandHorizontalScroll: true
				},
	 			theme:"dark-3"
			});
			$('#area_four').mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
			});*/
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
			$("#xscjcxgd").text("...More");
			$("#rwlscxgd").text("...More");
			}
		});
		
		
		// 加载第五块内容(校历)
		$("#area_five").load(_path + "/xtgl/index_cxAreaFive.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
			$("#area_five").mCustomScrollbar({
				autoHideScrollbar	: false,
				autoExpandScrollbar	: false,
				horizontalScroll 	: false,
				scrollInertia	 	: 0,
				scrollButtons:{
					enable		: true,
					scrollType	: "continuous",
					scrollSpeed	: 20,
					scrollAmount: 40
				},
				advanced:{
				    updateOnBrowserResize: true,
				    updateOnContentResize: true,
				    updateOnSelectorChange: false,
				    autoExpandHorizontalScroll: true
				},
	 			theme:"dark-3"
			});
			$('#area_five').mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
			});
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
				$("#xwgd").text("...More");
			}
		});
		
		
		
		// 加载第六块内容(校历及文件同时显示)
		$("#area_six").load(_path + "/xtgl/index_cxAreaSix.html?localeKey="+$("#localChange").val(), {}, function() {
			// 滚动条
			$("#area_six").mCustomScrollbar({
				autoHideScrollbar	: false,
				autoExpandScrollbar	: false,
				horizontalScroll 	: false,
				scrollInertia	 	: 0,
				scrollButtons:{
					enable		: true,
					scrollType	: "continuous",
					scrollSpeed	: 20,
					scrollAmount: 40
				},
				advanced:{
				    updateOnBrowserResize: true,
				    updateOnContentResize: true,
				    updateOnSelectorChange: false,
				    autoExpandHorizontalScroll: true
				},
	 			theme:"dark-3"
			});
			$('#area_six').mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
			});
			if($("#localChange").val()=='en_US'){//切换系统名称为英文的
				//$("#xwgd").text("...More");
			}
		});
		
	}
		
     //}

	function notEmptyTb(obj){
		if(!$.defined(obj)){
			obj = "/assets/images/ico/ico_apps.png";
		}
		return obj;
	}
	//应用显示名称过长用省略号表示
	function showGnmc(gnmc){
		if(gnmc.length > 9){
			gnmc = gnmc.substring(0,8)+"…";
		}
		return gnmc;
	}
		
	//查询最近使用
	$("#index_zjsy").load(_path + "/xtgl/index_cxZjsy.html?localeKey="+$("#localChange").val(), {}, function(data) {
		$("#index_zjsy").empty();
		var tempHtml = [];
		data = JSON.parse(data);
		if($.founded(data)) {
			$.each(data, function(index, item){
				var html='';
				html+='<li class="col-lg-4 col-md-4 col-sm-6 col-xs-6">';
				html+='<a onclick="clickMenu(\''+item.id+'\',\''+item.dyym+'\',\''+item.gnmkmc+'\'); return false;" href="#" rel="noopener noreferrer" target="_blank" title="'+item.gnmkmc+'">';
				html+='<img src="'+_stylePath+notEmptyTb(item.tblj)+'" style="width: 48px; height: 48px;">';
//				if(item.zjsybj=='2'){
//					html+='<h5>'+item.gnmkjc+'('+item.sycs+'次)</h5>';
//				}else{
					html+='<h5>'+showGnmc(item.gnmkjc)+'</h5>';
//				}
				
				html+='</a>';
				html+='</li>';
				tempHtml.push(html);
			});
			if(tempHtml.length>0) $("#index_zjsy").append(tempHtml.join(""));
		}
	});	
	init();
	function init(){
		//我的应用
		$("#index_wdyy").load(_path + "/xtgl/index_cxWdyy.html?localeKey="+$("#localChange").val(), {}, function(data) {
			$("#index_wdyy").empty();
			if($("#sfkzxs").val()=="1"&&($("#jsdm").val()=="xs"||$("#jsdm").val()=="js")){//教师及学生角色控制菜单显示
				$("#wdyy_szbtn").hide();
			}else{
				var tempHtml = [];
				data = JSON.parse(data);
				if($.founded(data)) {
					$.each(data, function(index, item){
						var html='';
						if(item.tbnmc!=null){
							html+='<li class="col-md-4 col-sm-4 col-xs-6">';
							html+='<a onclick="clickMenu(\''+item.id+'\',\''+item.dyym+'\',\''+item.gnmkmc+'\'); return false;" href="#" rel="noopener noreferrer" target="_blank" title="'+item.gnmkmc+'">';
							html+='<div class="icon-div">'+item.tbnmc+'</div>';
							html+='<h5>'+showGnmc(item.tbmc==null?item.gnmkmc:item.tbmc)+'</h5>';
							html+='</a>';
							html+='</li>';
							tempHtml.push(html);
						}else{
							html+='<li class="col-md-4 col-sm-4 col-xs-6">';
							html+='<a onclick="clickMenu(\''+item.id+'\',\''+item.dyym+'\',\''+item.gnmkmc+'\'); return false;" href="#" rel="noopener noreferrer" target="_blank" title="'+item.gnmkmc+'">';
							html+='<img src="'+_stylePath+notEmptyTb(item.tblj)+'" alt='+item.gnmkmc+' >';
							html+='<h5>'+showGnmc(item.tbmc==null?item.gnmkmc:item.tbmc)+'</h5>';
							html+='</a>';
							html+='</li>';
							tempHtml.push(html);
						}
					});
					if(tempHtml.length>0) $("#index_wdyy").append(tempHtml.join(""));
				}
			}
		});
	}
	
	//我的应用设置按钮
	$("#wdyy_szbtn").click(function(){
		var name="管理我的应用";
		if($("#localChange").val()=='en_US'){
			name="Manage my application";
		}
		$.showDialog(_path +"/xtgl/index_cxGlwdyyView.html",name, $.extend({},viewConfig,{
			modalName:"wdyyModal",
			width : ($("#yhgnPage").innerWidth())+"px",
			height: "800px",
		    onClose:function(){
			   init();
		    }
		}));
	});
	
	//功能检索按钮
	$("#gnjs_btn").click(function(){
		var name="功能检索";
		if($("#localChange").val()=='en_US'){
			name="Application search";
		}
		$.showDialog(_path +"/xtgl/index_cxGnjsView.html",name, $.extend({},viewConfig,{
			modalName:"gnjsModal",
			width : ($("#yhgnPage").innerWidth())+"px",
			height: "500px",
		    onClose:function(){
			   init();
		    }
		}));
	});
	
	
	$("#area_three").off("click","a[name='xxdlTail']").on("click","a[name='xxdlTail']",function(){
		$.post(_path + '/xtgl/index_cxXxdlztgx.html',
				   {zjxx:$(this).attr("data-zjxx")},
				function(data){
					   $("#area_three").empty();
						$("#area_three").load(_path + "/xtgl/index_cxAreaThree.html?localeKey="+$("#localChange").val(), {}, function() {
							if($("#localChange").val()=='en_US'){//切换系统名称为英文的
								$("#lj").text("...More");
							}
						});
				},'json');
	});
	if($("#mxqyxwxkctskg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxXttsxx.html?bj=1',
	    function(data){
			if(data.indexOf("请核实") > -1){
				$.showDialog(_path + '/query/query_cxFckContent.html','应选未选课程提醒',{
					modalName:"yxwxmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								var $this = this;
								$.closeModal("yxwxmodal");
								return false;
							}
						}/*,
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}*/
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	if($("#xxkwdbyyqxftskg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxXttsxx.html?bj=2',
	    function(data){
			if(data.indexOf("请核实") > -1){
				$.showDialog(_path + '/query/query_cxFckContent.html','选修课毕业学分未达标提醒',{
					modalName:"xxkxfmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								var $this = this;
								$.closeModal("xxkxfmodal");
								return false;
							}
						}/*,
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}*/
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	//是否开启毕设选题时间提醒
	if("1" == $("#sfkqbsxtsjtx").val()){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxBsxtsj.html',
	    function(data){
			if(data.indexOf("截止时间") > -1 ){
				var smUrl = _path + '/query/query_cxFckContent.html';	
				var dialogConfig = $.extend(true,{},viewConfig,{
					modalName:"modal",
					width:"500px",
					data:{'content':data},
					/*buttons:{
						cancel : {
							label : "关闭",
							className : "btn-primary",
								callback : function() {
								}
						}
					}*/
				});
				$.showDialog(smUrl,'毕设选题时间提醒',dialogConfig);
			} 
		});
		$.ajaxSetup({async:true});
	}
	

	if($("#kksytcyjkg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxKkyjxx.html',
	    function(data){
			if($.founded(data) && data.indexOf("特别提醒") > -1){
				$.showDialog(_path + '/query/query_cxFckContent.html','旷课预警',{
					modalName:"xxkxfmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								var $this = this;
								$.post(_path + '/xtgl/index_cxKkyjxxUpdate.html',function(data){
									if(data=="0"){
										$.error("出现未知异常！");
									}
								});
								$.closeModal("xxkxfmodal");
								return false;
							}
						}/*,
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}*/
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	
	//是否开启确认学分时间提醒
	if("1" == $("#sfkqxfqrsjtx").val()){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxXfqrsj.html',
	    function(data){
			if(data!='无需提示'){
				var smUrl = _path + '/query/query_cxFckContent.html';	
				$.showDialog(smUrl,'选课学分确认时间提醒',{
					modalName:"xxxxmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								var $this = this;
								$.closeModal("xxxxmodal");
								openWin('../kbcx/xskbqr_cxXskbqrIndex.html?doType=details', {'gnmkdm': 'N2158'}, true);
								return false;
							}
						}/*,
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}*/
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	
	//是否开启劳育预警提醒
	if("1" == $("#sfkqlyyjtx").val()){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxLyyjxx.html',
	    function(data){
			if(data.indexOf("劳育成果申报") > -1){
				var smUrl = _path + '/query/query_cxFckContent.html';	
				$.showDialog(smUrl,'劳育预警提醒',{
					modalName:"xxxxmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	
	//是否开启教师监考信息提醒
	if("1" == $("#sfkqjsjkxxtx").val()){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxJsjkxxList.html',function(data){
			if($.founded(data) && typeof data=='object' && data.length>0){
				$.showDialog(_path + '/xtgl/index_cxJsjkxxView.html',"监考信息提醒",$.extend(true,{},viewConfig,{
					width:"800px",
					modalName:"jkxxModal",
					data : {"list":data}
				}));
			}
		});
		$.ajaxSetup({async:true});
	}
	//未绑定个人信息提醒
	if("1" == $("#wbdgrxxtx").val()){
		$("#updateGrxx").trigger("click");
	}
	
	
	//学生评价首页提示语，为空则不提醒
	if ("xs" == $("#jsdm").val() && $.founded($("#xspjsytsy").val())) {
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxXspjWtjNum.html',function(data){
			if (data > 0) {
				$.confirm($("#xspjsytsy").val(),function(result){
					if(result){
						openWin('../xspjgl/xspj_cxXspjIndex.html?doType=details', {'gnmkdm': 'N401605'}, true);
					}
				});
			}
		});
		$.ajaxSetup({async:true});
	}
	
	if($("#jsdm").val()=='xs' && $("#fxjfjzrqqjtts").val()*1>0){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxFxjftsNum.html',{"fxjfjzrqqjtts":$("#fxjfjzrqqjtts").val()},function(data){
			if(data=="0"){
				$.error("出现未知异常(ERROR-fx001)！");
			}else if ($.founded(data) && data!="1") {
				$.alert("辅修微专业缴费截止日期为："+data.jzrq+"，请及时完成缴费！",function(){
					if(data.tzbj=="1"){
						$.post(_path + '/xtgl/index_cxUpdateFxjftszt.html',{},function(data){
							if (data=="0") {
								$.error("出现未知异常(ERROR-fx002)！");
							}
						});
					}
				});
			} 
		});
		$.ajaxSetup({async:true});
	}
	
	//同行评价（课程）首页提示语，为空则不提醒
	if ("js" == $("#jsdm").val() && $.founded($("#thpjsytsy").val())) {
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxThpjWtjNum.html',function(data){
			if (data > 0) {
				$.confirm($("#thpjsytsy").val(),function(result){
					if(result){
						openWin('../jxbpjgl/thpjkc_cxThpjkcIndex.html', {'gnmkdm': 'N401622'}, true);
					}
				});
			}
		});
		$.ajaxSetup({async:true});
	}
	
	//督导评价（课程）首页提示语，为空则不提醒
	if ("js" == $("#jsdm").val() && $.founded($("#ddpjsytsy").val())) {
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxDdpjWtjNum.html',function(data){
			if (data > 0) {
				$.confirm($("#ddpjsytsy").val(),function(result){
					if(result){
						openWin('../jxbpjgl/ddpjkc_cxDdpjkcIndex.html', {'gnmkdm': 'N401637'}, true);
					}
				});
			}
		});
		$.ajaxSetup({async:true});
	}
	
	//领导评价（课程）首页提示语，为空则不提醒
	if ("js" == $("#jsdm").val() && $.founded($("#ldpjsytsy").val())) {
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxLdpjWtjNum.html',function(data){
			if (data > 0) {
				$.confirm($("#ldpjsytsy").val(),function(result){
					if(result){
						openWin('../jxbpjgl/ldpjkc_cxLdpjkcIndex.html', {'gnmkdm': 'N401642'}, true);
					}
				});
			}
		});
		$.ajaxSetup({async:true});
	}
	
	//是否开启川大华西监考信息提醒
	if("1" == $("#sfkqcdhsjktx").val()){
		$.ajaxSetup({async:false});
		$.post(_path + '/xtgl/index_cxKsjkxxList.html',function(data){
			if(data.indexOf("考试监考信息") > -1){
				var smUrl = _path + '/query/query_cxFckContent.html';	
				$.showDialog(smUrl,'监考信息提醒',{
					modalName:"xxxxmodal",
					width:"500px",
					data:{'content':data},
					buttons		:{
						success : {
							label : "确定",
							className : "btn-primary",
							callback : function(){
								var $this = this;
								$.closeModal("xxxxmodal");
								openWin('../jkap/ksjkxxcx_cxKsjkxxcxIndex.html?doType=details', {'gnmkdm': 'N353088'}, true);
								return false;
							}
						}/*,
						cancel : {
							label : "关 闭",
							className : "btn-default",
							callback : function(){	
							}
						}*/
					}
				});
				
			}
		});
		$.ajaxSetup({async:true});
	}
});


//选课业务选择判断(演示用)
function getXsxkzt(){
	//判断学生选课状态
	var xsxkzt = $("#xsxkzt").val();
	if("1" == xsxkzt){	//直接选课
		$.confirm("当前时间段可选课,是否进行选课?",function(result){
			if(result){
				openWin('../xsxk/zzxkyzb_cxZzxkYzbIndex.html', {'gnmkdm': 'N253512'}, true);
			}
		});
	}else if("2" == xsxkzt){	//先评价，再选课
		$.confirm("您尚未完成学生评价,是否进行评价?",function(result){
			if(result){
				openWin('../xspjgl/xspj_cxXspjIndex.html?doType=details', {'gnmkdm': 'N401605'}, true);
			}
		});
	}
}

//首页提醒状态
function getSytxzt(){
	//判断首页提醒状态
	var sytxzt = $("#sytxzt").val();
	if("1" == sytxzt){	//选课提醒
		$.confirm("当前时间段可选课,是否进行选课?",function(result){
			if(result){
				openWin('../xsxk/zzxkyzb_cxZzxkYzbIndex.html', {'gnmkdm': 'N253512'}, true);
			}
		});
	}else if("2" == sytxzt){	//评价提醒
		$.confirm("当前时间段可评价,是否进行评价?",function(result){
			if(result){
				openWin('../xspjgl/xspj_cxXspjIndex.html?doType=details', {'gnmkdm': 'N401605'}, true);
			}
		});
	}else if("98" == sytxzt){	//进行多业务选择
		$.showDialog(_path + "/xtgl/index_cxKczywIndex.html",'访问业务选择',$.extend(true,{},addConfig,{
			width:"450px",
			modalName:"cxKczywModal",
			buttons:{
				
				},
				cancel : {
					label : "关 闭",
					className : "btn-default"
				}
			}
		));
	}
}

function getXsxjyj(){
	$.showDialog(_path + "/xtgl/index_cxXjyjtxIndex.html",'学籍预警提醒',$.extend(true,{},addConfig,{
		width:"1200px",
		modalName:"cxXjyjtxModal",
		buttons		:{
				success : {
					label : "我已知晓",
					className : "btn-primary",
					callback : function(){
						var $this = this;
						getXsxkzt();	//选课业务选择判断(演示用)
						getSytxzt();	//首页提醒状态
						$.closeModal("cxXjyjtxModal");
						openWin('../xjyj/xjyj_cxXjyjIndex.html', {'gnmkdm': 'N105505'}, true);
						jQuery.post(_path +'/xtgl/index_cxXjyjqrzt.html',"",function(data){
						},'json');
						return false;
					}
				},
				cancel : {
					label : "关 闭",
					className : "btn-default",
					callback : function(){	
						getXsxkzt();	//选课业务选择判断(演示用)
						getSytxzt();	//首页提醒状态
					}
				}
			}
		}
	));
}