var mictest=mictest||{};
!function(m){
	"use strict";
	mictest.menu={
		touchDevice:"ontouchstart"in window?1:0,
		runJS:0,menuWrap:"",
		respMenuBtn:"",
		added:!1,
		ready:function(){
			mictest.menu.runResponsive()
		},
		load:function(){
			mictest.menu.runResponsive()
		},
		runResponsive:function(){
			2<=mictest.menu.runJS&&0==mictest.menu.added&&(mictest.menu.added=!1,mictest.menu.addResponsiveMenu())
		},
		addResponsiveMenu:function(){
			var n=mictest.menu,t=m(window);
			n.menuWrap=m(".sAs.left:first"),
				n.menuWrap.append('<div id="sAs-menu-responsive" data-state="off"><span></span></div>'),
				n.respMenuBtn=n.menuWrap.find("#sAs-menu-responsive"),
				0<n.respMenuBtn.length&&n.respMenuBtn.on("click",function(e){
				var t=m(this);
				"on"==t.attr("data-state")?(t.attr("data-state","off"),
											n.menuWrap.attr("style","left: -240px !important;")):(t.attr("data-state","on"),n.menuWrap.attr("style","left: 0px !important;"))}),
				t.on("resize",function(e){
				1024<t.width()&&(0<mictest.menu.menuWrap.length&&mictest.menu.menuWrap.attr("style",""),
								 0<mictest.menu.respMenuBtn.length&&mictest.menu.respMenuBtn.attr("data-state","off")),
					768<t.width()?(mictest.menu.menuWrap.off("click","nav li",
															 mictest.menu.addResponsiveSubMenuClick),mictest.menu.menuWrap.find("nav ul").attr("data-state","off"),
								   mictest.menu.topLvelID=-1):(mictest.menu.menuWrap.off("click","nav li",mictest.menu.addResponsiveSubMenuClick),
															   mictest.menu.menuWrap.on("click","nav li",mictest.menu.addResponsiveSubMenuClick))}),
				t.width()<768&&(mictest.menu.menuWrap.off("click","nav li",mictest.menu.addResponsiveSubMenuClick),
								mictest.menu.menuWrap.on("click","nav li",mictest.menu.addResponsiveSubMenuClick))},
		topLevelID:-1,
		addResponsiveSubMenuClick:function(e){
			var t=m(this),
				n=t.find("> ul"),
				u=t.closest("li.toplvl");
			if(0<u.length){
				var i=u.index();
				-1!=mictest.menu.topLvelID&&mictest.menu.topLvelID!=i&&mictest.menu.closeSubMenu(mictest.menu.topLvelID),
					mictest.menu.topLvelID=i
			}
			else
				-1!=mictest.menu.topLvelID&&(mictest.menu.closeSubMenu(mictest.menu.topLvelID),
											 mictest.menu.topLvelID=-1);
			if(console.log("addResponsiveSubMenuClick",u),
			   console.log("addResponsiveSubMenuClick",n),
			   0<n.length){
				var s=t.attr("data-state");
// 				s="on"!=s&&"off"!=s?"on":"on"==s?"off":"on",n.attr("data-state",s)
			}
		},
		closeSubMenu:function(e){
			if(null==e)return!1;
			console.log("closeSubMenu ",e);
			var t=mictest.menu.menuWrap.find("nav > ul > li:eq("+e+")");
			0<t.length&&t.find("ul").each(function(e,t){
				console.log("Closing submenu: ",m(t)),
					m(t).attr("data-state","off")
			})
		}
	},
	m(document).ready(function(){
		mictest.menu.runJS++,mictest.menu.ready()
	}),
	m(window).load(function(){
		mictest.menu.runJS++,mictest.menu.load()
	})
}(jQuery);