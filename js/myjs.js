$(function(){
    var $gezi ;
    var arr = [];
    var click_num = 0;
    function make_gezi(){//这个是用arr[][]去表示格子
        var num=0;
        for (var i = 0; i < 256; i++) {  
        $('.context').append($('<div class="gezi"></div>'))}
        $gezi =$(".gezi"); 
        for(var i = 0; i < 16; i++){
            var arr_range = [];
            for (var j = 0; j < 16; j++) {
                arr_range[j] = $gezi.eq(num); //可以写成$gezi[num],传进去是html元素
                num++;                        //写成这样传进去$对象
            };
            arr[i] = arr_range;
        };
    }
    make_gezi();
           
     
    function mine(x,y){ //这是埋地雷
        $img = $('<img class="img_boom" src="images/boom.png" >');//相对位置以html的位置为准
        var i=Math.floor(Math.random()*16);
        var j=Math.floor(Math.random()*16);
        while(i >= x-1 && i <= x+1 && j >= y-1 && j <= y+1) {
            var i=Math.floor(Math.random()*16);
            var j=Math.floor(Math.random()*16);
        }
        if(arr[i][j].html()==="")
            arr[i][j].append($img);
        else{
            return mine(x,y);
        }     
    }


    function count_mine(x,y){ //计算雷数目 只能数传进来的这个格子
        var mine_num=0;
        if(!arr[x][y].find(".img_boom").length){
            for(var i = x-1 ;i < x+2; i++){ //从左上角开始看有没有雷
                if(i < 0 || i > 15){
                    continue;}  
                for (var j = y-1; j < y+2; j++) {
                    if(j < 0 || j > 15){
                        continue;} 
                    if(arr[i][j].find(".img_boom").length){
                        mine_num++;
                    }
                };
            };
           arr[x][y].text(arr[x][y].text()=='b' ? 'b' :mine_num);
           arr[x][y].css("background","#fff")
        }   
    }

    $gezi.click(function(){
        var x=0;var y=0; //x,y去定义格子的坐标
        for(var i = 0;i < 16; i++){
            for (var j = 0; j < 16; j++) {
                if($(this)[0]===arr[i][j][0]){
                    x=i;
                    y=j;
                }
            };
        };
        //第一次点击时
        if(click_num===0){
            click_num++;//让点击数不在为0；
            for (var i = 0; i < 40; i++) {//埋40个雷
                 mine(x,y);
            };
            nine_count_mine(x,y);//九宫格爆炸
            boom();//如果有格子的四周雷数为0时，再爆炸 
          
        }

        else{//不是第一次点击
            if(Number($(this).text())===flag_num(x,y) && $(this).text()){
                console.log(flag_num(x,y));
                nine_count_mine2(x,y);
                boom();//如果有格子的四周雷数为0时，再爆炸 
            }
            else{
                if($(this).find('.img_boom').length){
                    gameOver()
                }
                else if($(this).find('.img_flag').length){
                    console.log("flag")
                }
                else{
                    count_mine(x,y);
                    boom();
                }
            }
        }
    })

    function nine_count_mine(x,y){//传入格子坐标，数四周八个格子雷数目
        for(var i = x-1 ;i < x+2; i++){ 
            if(i < 0 || i > 15){
                    continue;}  
            for (var j = y-1; j < y+2; j++) {
                if(j < 0 || j > 15){
                    continue;
                    }
                count_mine(i,j);  
            };
        };
        arr[x][y].text('b')
    }

    function boom(){//当格子为雷数0时 boom四周格子
        $gezi.each(function(){
            var x=0;
            var y=0;
            if($(this).text()==='0'){
                for(var i = 0;i < 16; i++){
                    for (var j = 0; j < 16; j++) {
                        if($(this)[0]===arr[i][j][0]){
                            x=i;
                            y=j;
                        }
                    };
                };
                nine_count_mine(x,y);
                return boom()   
            }
        }) 
        $gezi.each(function(){//让数字0或者字母b消失；
                if($(this).text()==='b'||$(this).text()==='0')
                    $(this).text('');})
       
    }
    $gezi.mousedown(function(e){//右键插旗子
        if(e.which===3){
            $(document).bind("contextmenu",function(e){//阻止右键出现菜单
                e.preventDefault();
                return false;
            });
            flag($(this));
    }
  })
    function flag(that){ 
        if(that.css("background-color")==='rgb(170, 170, 170)'){
            if(!that.find(".img_flag").length){
                that.append($('<img class="img_flag" src="images/flag.png" >'));
            } 
            else{
                that.find(".img_flag").remove() 
            }
        }
    }
    function flag_num(x,y){
        var flagNum=0;
        if(!arr[x][y].find(".img_flag").length){
            for(var i = x-1 ;i < x+2; i++){ //从左上角开始看有没有雷
                if(i < 0 || i > 15){
                    continue;}  
                for (var j = y-1; j < y+2; j++) {
                    if(j < 0 || j > 15){
                        continue;} 
                    if(arr[i][j].find(".img_flag").length){
                        flagNum++;
                    }
                };
            };
        }
        return flagNum;         
    }

    function nine_count_mine2(x,y){ //传入格子坐标，数四周八个格子雷数目
        for(var i = x-1 ;i < x+2; i++){ 
            if(i < 0 || i > 15){
                    continue;}  
            for (var j = y-1; j < y+2; j++) {
                if(j < 0 || j > 15){
                    continue;} 
                if(arr[i][j].find('.img_flag').length){console.log(arr[i][j].find('.img_flag'));
                    continue;
                     console.log("ss");
                }
                if(arr[i][j].find('.img_boom').length){
                    gameOver()
                    break;
                }
                count_mine(i,j);
            };
        };
    }
    function gameOver(){
        $('.img_flag').width('0px');
        $('.img_boom').width('18px');
        alert("game over")
    }

})
    