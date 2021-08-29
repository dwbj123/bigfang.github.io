
								var ad_exposure = false; // 广告曝光统计
					     	var load_ad = function(){
								var pucl = document.getElementById("article_bottom");
								
								if(pucl != null){
									var script = document.createElement("script");
							        script.src = "//ggs.myzaker.com/zk_wap_ggs.php?gg_id=&gg_height=60&gg_group=wap_bottom_banner&new_type=1&pk=612b4bfeb15ec0598511a8df&app_id=568&author=%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6&http_type=1&url_host=news.mydrivers.com&jsoncallback=jsonp1&_=1630240518469";
							        script.type = "text/javascript";
							        pucl.appendChild(script);
			
								}
							}
			
							var get_content_bottom_y = function(){
			
								if(isWap){
									var divContent = document.getElementById("content_text");
									if(divContent){
										return parseInt(divContent.offsetHeight);
									}
								}else{
									if(!$ && !jQuery){
										return 0;
									}
									var divContent = $("#content_text");
									if(divContent){
										return parseInt(divContent.css("height"));
									}
								}
								
								return 0;
							}
							
							if(typeof ad_load == 'undefined'){
								ad_load = true;
								load_ad();
								windowHeight = window.screen.height;
						
								//documentHeight = document.body.scrollHeight;
								documentHeight = get_content_bottom_y();
							}
							
							var ratio = window.devicePixelRatio;
							var _ad = document.querySelector('#article_bottom');
							var _adHeight =_ad.offsetHeight*ratio;
							var _ad_top = _ad.offsetTop*ratio;
							var _adtimer = null;
							var _adtimes = 0, _stayTime = 500;  // 广告停留在屏幕的时间值（才计算曝光统计,单位毫秒）
							var mayload = function(){
								
								documentHeight = get_content_bottom_y();
								if(documentHeight <= 0){
									return;
								}

			
								scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
			
								if((documentHeight > windowHeight && scrollTop >= documentHeight - windowHeight) || (documentHeight < windowHeight && scrollTop != 0)){
						
									// if(ad_load == false){
									// 	ad_load = true;
										
									// 	load_ad();
									// }
									if(window.ad_load == true && window.ad_exposure == false) {
										if(window.ad_count && typeof window.ad_count === "function") {
											ad_count(function(){
												ad_exposure = true;
											})
										} 										
									}	
								}
						        
						    }			
							
							if(documentHeight < windowHeight){
								mayload();
							}
							if(0 == 1){
								if(ad_load == false){
									ad_load = true;
									load_ad();
								}
							}			
							window.onscroll = mayload;
						
					