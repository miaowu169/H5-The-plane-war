

'use strict';

         window.onload = function(){	
            myGame.init();
         }

         var myGame = {

            data : {  //飞机数据
                ENEMY : {
                    blood : 1,
                    bullet : true,
                },
			
				PLANE:{
					goto_fire:false,
					p_blood : 100
				},

            },

            init : function(){ //初始化

                var layout = document.getElementById('layout'),
                    mystart = document.getElementById('start'),
                    bloods = document.getElementById('rec'),
                    That = this;

				bloods.style.width = '300px';
				bloods.style.height = '40px';
				bloods.style.left = '0px';
				bloods.style.top = '0px';
				bloods.style.background = 'green';
				bloods.style.display = 'block';	
                this.layout = layout;
                this.mystart = mystart;
                this.bloods = bloods;

                document.getElementById('startBtn').onclick = function() {
                    mystart.style.display = 'none';
                    That.createPlane();
                    document.getElementsByClassName('bloods')[0].style.display = 'block';
                };

            },

            createPlane : function(){  //创建飞机
                var That = this;

                var plane = document.createElement('div');
                plane.className = 'plane';
                plane.style.width = '137px';
				plane.setAttribute('p_blood',100);
                plane.style.left = (this.layout.offsetWidth - plane.offsetWidth) / 2 + 'px';
                this.layout.append( plane );

                this.plane = plane;
				
				var eng = document.createElement('div');
				var tim = 0;
				eng.itimer1 = setInterval(function(){
					tim++;
					var position_left =  plane.offsetLeft + plane.offsetWidth/2 - 14;
					var position_top = plane.offsetTop + 85;
					if(tim % 2 == 0){
						if(this.layout.classList.contains('eng'))
						this.layout.removeChild('eng');
						eng.className = 'engine1';
						eng.style.left = position_left + 'px';
						eng.style.top = position_top + 'px';
						this.layout.append(eng);
						return;
					}
					
					if(tim % 2 == 1){
						if(this.layout.classList.contains('eng')){
							this.layout.removeChild('eng');	
						}
						eng.className = 'engine2';
						eng.style.left = position_left + 'px';
						eng.style.top = position_top + 'px';
						this.layout.append(eng);
						return;
					}
				},40);
				

               // this.bindPlane(plane);
			   
                plane.itimer2 = setInterval(function(){
                    That.createEnemy();
                },~~(Math.random() * (2500-400 + 1) + 400));
				
				this.runPlane(plane);	
            },
			
			runPlane:function(p){
				var obj = p;
				var That = this;
				var codeType = {
					"up":false,
					"down":false,
					"left":false,
					"right":false,
					"fire":false
				}
				setInterval(Move,50);
				
				var go_speed = 10;
				
				window.onkeydown = function(event){
					var e = event || window.event || arguments.callee.caller.arguments[0];

					//保护源码的措施
					//F12
					 if(e.keyCode == 123){
						alert('你瞅啥');
						 return false;
					 };
					 
					if(event.keyCode == 38){
						codeType.up = true;
					}
					if(event.keyCode == 40){
						codeType.down = true;
					}
					if(event.keyCode == 37){
						codeType.left = true;
					}
					if(event.keyCode == 39){
						codeType.right = true;
					}
					if(event.keyCode == 66){
						That.createBullet('b1',obj,0,1);
						document.getElementById("fire").play();
						//codeType.fire = true;
					}
				}
				
				window.onkeyup = function(event){
					if(event.keyCode == 38){
						codeType.up = false;
					}
					if(event.keyCode == 40){
						codeType.down = false;
					}
					if(event.keyCode == 37){
						codeType.left = false;
					}
					if(event.keyCode == 39){
						codeType.right = false;
					}

				}
				
				function Move(){
					if(codeType.up){
						if(parseInt(obj.style.top)<=30)
						{
							return;
						}
						obj.style.top = obj.offsetTop - go_speed +'px';
					}
					if(codeType.down){
						if(parseInt(obj.style.top)<800)
						{
							obj.style.top = obj.offsetTop + go_speed +'px';
						}
					}
					if(codeType.left){
						if(parseInt(obj.style.left)>-10){
							obj.style.left = obj.offsetLeft - go_speed +'px';
						}
					}
					if(codeType.right){
						if(parseInt(obj.style.left) <= 1800){
							obj.style.left = obj.offsetLeft + go_speed +'px';
						}
					}
				}
			},

            createEnemy : function(){   //创建敌机
                var ey = document.createElement('div');
                ey.className = 'enemy';

                ey.style.cssText = 'width:' + 100 + 'px; height:' + 75 + 'px';
				
				ey.style.top = ~~(Math.random()*(0 + 3000 + 1) -3000);
                ey.style.left = ~~(Math.random()*(this.layout.offsetWidth - 100)) + 'px';
                ey.setAttribute('blood', 1);
                ey.setAttribute('bullet', true);
				ey.setAttribute('down_speed',~~(Math.random()*(9-4)+4));
				ey.setAttribute('leri_speed',~~(Math.random()*(5-(-5))+(-5)));

                this.layout.append(ey);

                //子弹碰撞
                if(this.data.ENEMY.bullet){
                    var That = this;
                    ey.timer1  = setInterval(function(){
                        That.createBullet('b2',ey, ey.offsetHeight, -1);
                    },~~(Math.random()*(3000-1000+1) + 1000	));

                }

                this.runEnemy(ey);
            },

            runEnemy : function(obj){   //敌机运动
                var That = this;
				var ene_down_speed = parseInt(obj.getAttribute('down_speed'));
				var ene_leri_speed = parseInt(obj.getAttribute('leri_speed'));
                obj.timer = setInterval(function(){

                    obj.style.top = (obj.offsetTop + ene_down_speed) + 'px';
					obj.style.left = (obj.offsetLeft + ene_leri_speed) + 'px';

                    if(obj.offsetTop > That.layout.offsetHeight){
                        clearInterval(obj.timer);
                        obj.parentNode.removeChild(obj);
                    };
                },30)
            },

            createBullet : function(name, obj, h, direction){  //创建子弹

                var bt = document.createElement('div');
                bt.className = name;

                var _p = obj;

                bt.style.top = (_p.offsetTop + h - bt.offsetHeight * direction) - 20 + 'px';
                if(name == 'b1'){
					this.data.PLANE.goto_fire = !(this.data.PLANE.goto_fire);
					if(this.data.PLANE.goto_fire){
						bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) + 15 + 'px';
					}else{
						bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) - 32 + 'px';
					}
				}else{
					bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) - 4 + 'px';
				}
                this.layout.append(bt);

                if(bt.classList.contains('b1')){
                   this.runBullet(bt,0,-30);
                }else{

                   // this.speedDecomposition(this.plane,bt);
                    this.runBullet(bt,0,10);

                }
            },


            runBullet : function(b,x,y){   //子弹运动

                var That = this;
				var b_div = That.bloods;

                b.timer = setInterval(function(){

                    if(b.offsetTop <= 0 || b.offsetTop >= That.layout.offsetHeight || b.offsetLeft <= 0 || b.offsetLeft >= That.layout.offsetWidth){   //边界判断

                        clearInterval(b.timer);
                        That.layout.removeChild(b);

                    }else{

                       b.style.cssText = 'top : ' + (b.offsetTop + y) + 'px; left : ' + (b.offsetLeft + x) + 'px';

                    }

                    for(var i = 0, EN = document.getElementsByClassName('enemy'), len = EN.length ; i < len ; i++ ){

                        if(That.TC(EN[i],b) && b.classList.contains('b1')){
                            clearInterval(b.timer);
                            That.layout.removeChild(b);
                            var Blood = EN[i].getAttribute('blood') - 1;
							
                            if(Blood){
                                EN[i].setAttribute('blood',Blood);
                            }else{
								//That.Boom(EN[i].style.left,EN[i].style.top);
								//EN[i].style.position = relative;
								That.boom(EN[i].style.top,EN[i].style.left);
								//EN[i].style.background = 'url(img/baozha_2.gif) center no-repeat / cover';
                                var pare = EN[i];
                                EN[i].classList.remove("enemy");
                                EN[i].timer = setTimeout(function(){That.layout.removeChild(pare)},400);
                            }

                        }

                    }

                    if(That.TC(That.plane,b) && b.classList.contains('b2')){
                        clearInterval(b.timer);
                        That.layout.removeChild(b);
						var Plane_blood = That.plane.getAttribute('p_blood') - 20;
						
						
						if(Plane_blood){
							//b_div.style.width -= '100px';
							b_div.style.width = (parseInt(Plane_blood)) + "%";
							console.log(b_div);
							That.bloods.innerHTML = (parseInt(Plane_blood)) + '%';
							
							if(Plane_blood <= 40){
								b_div.style.background = 'red';
							}
							
							That.plane.setAttribute('p_blood',Plane_blood);
						}else{
							That.layout.removeChild(That.plane);
							That.gameOver();
							b_div.style.width = '100%';
							b_div.style.background = 'green';
						}
                    }


                },30)
            },
			
			boom: function(l,h){
				var names = document.getElementById("show");
				document.getElementById("boom").play();
				names.style.width = '100px';
				names.style.height = '70px';
				names.style.top = l;
				names.style.left = h;
				names.style.position = 'absolute';
				names.style.display = 'block';
				window.setTimeout(function(){
					names.style.display = 'none';
				},800);
			},
			

            gameOver : function(){

                document.getElementById("fire").pause();
                document.getElementById('bigboom').play();

                clearInterval(this.plane.itimer2);
                clearInterval(this.plane.itimer1);

                this.mystart.style.display = 'block';
                document.getElementsByClassName('bloods')[0].style.display = 'none';
                document.getElementById('name-over').getElementsByTagName('i')[0].innerHTML = 'GAME OVER!';
                document.getElementById('startBtn').value = 'AGAIN';

                while(this.layout.hasChildNodes()){
                    this.layout.removeChild(this.layout.firstChild);
                };

                this.bloods.innerHTML = '100%';
            },

            TC : function(obj1,obj2){   //碰撞检测

                var t1 = obj1.offsetTop,                      //上
                    r1 = obj1.offsetLeft + obj1.offsetWidth,  //右
                    b1 = obj1.offsetTop + obj1.offsetHeight,  //下
                    l1 = obj1.offsetLeft,                     //左

                    t2 = obj2.offsetTop,                      //上
                    r2 = obj2.offsetLeft + obj2.offsetWidth,  //右
                    b2 = obj2.offsetTop + obj2.offsetHeight,  //下
                    l2 = obj2.offsetLeft;                     //左

                if(t1 > b2 || b1 < t2 || r1 < l2 || l1 > r2){
                    return false;
                }else{
                    return true;
                }
            },
         }