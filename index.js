

/// rectstart is the private variable used to hold privateShape();
var rectStart;
/// score keeps the score of the game. It is a global variable so that the score can be updated & displayed throughtout the game and after it ends.
var score = 0;





/// Called using a private variable
function privateShape(){

    ///// global variables
    var canvas;
    var ctx;

    /// width and height of canvas
    var w = 600;
    var h = 800;



    /// timePause is later used to store setTimeout to pause and resume the game
    var timePause;

    /// toggles pause on and off 
    var pause = false;
    /// setNum is used to set the amount of time between each setTimeout loop
    var setNum = 5000;
    

    /// defining arrays that will hold objects with properties that will be used to draw the shapes to the screen
    var buildSquare = [];
    var buildStartBox = [];
    var buildPointShape = [];
    var buildDownSquare = [];
    var buildShape = [];
    var buildCirclePoint = [];

    let drawCounter = 0;



    /// this variable will move the shapes downwards during each animation loop. 
    /// looks as if the camera is moving upwards
    var move = -1;
    /// the speed will control the jump and setNum
    /// it will also be multiplied with the variable "move" each loop to cause the screen to move upwards faster
    var speed = 1.0005;
    
    
    
    /// 3 colours are used for all shapes
    /// the player changes to these colours based on the shape it touched last
    var colour = [180,240,300];
    
    /// value of 1 radian
    var oneDegree = Math.PI/180;
    
    /// value of 1 radian
    var movingSquare = false;


    /// creates circle sparkle effect everytime the player gains a point
    var t = 0;


    
    /// number to control the location of the upwards square shape using the remainder operator
    var alt = 0;
    /// number to control the angle of the downwards square shape using the remainder operator
    var mov = 0;
       /// number to control the angle of the upwards square shape using the remainder operator
    var mov2 = 0;
    /// number to control the colour of the upwards square shape using the remainder operator
    var co = 0;

    /// controls the side it will move on jump (left or right)
    var m;


    /// this object holds the properties for the player
    var  player = {
        "x" : w/2,
        "y" : 50,
        "size" : 50,
        "dr":200,
        "r":75,
        "c": 300,
        "a": 0.5,
        "jumpHeight" : 13,
        "shouldJump" : false,
       "jumpCounter" : 20,
       "startCounter" : 0,
        "spin" : 0,
        "spinIncrement" : 90/32,
        "angle": 0,
        "changle": 15,
        "side": 200,
        "d":50,
        "g": 0,
        "s": 4
    }
    

    /// this object holds the properties for the box at the start
    var buildStartBox = {
        "x" : w/2,
        "y" : 250,
        "w": 200,
        "h": 200,
        "c": 200,
        "a": 0.5,
        "angle": 0,
        "changle": 15,
        "d":200,
        "side": 800,
        "col": false,
        "colliding": false,
        "s": 4
    }
    
    

    


        
    // /// different keyboard key click
    document.onkeydown = keyDownChange;



    /// calling to set up the cavas
    setUpCanvas ();

    /// pushes objects into the array
    createPoints();
    createUpSquares();

    /// calling animationLoop
    animationLoop();
    
    
    
    
    
    
    function keyDownChange(event){
      
        /// when the spacebar is pressed, the animation loop and the square's setTimeout will pause/resume
        if(event.keyCode == 32){
            /// if pause is false, everything will stop and pause will be true
            if (!pause){
                /// https://stackoverflow.com/questions/3969475/javascript-pause-settimeout
                window.clearTimeout(timePause);
                timePause = null;
                /// https://www.w3schools.com/tags/canvas_filltext.asp
                ctx.font = "75px Roboto";
                ctx.textAlign = "center";
                /// https://www.w3schools.com/tags/canvas_textalign.asp
                ctx.fillText("l l", w/2,h/2);
                
                pause = true;
            
            }
            /// if pause is true, everything will resume and pause will be false
            else {
                if (timePause) {
                    return;
                }
                pause = false;
                animationLoop();
                timePause = setTimeout(createUpSquares, setNum);
            }

        }
        /// when esc is pressed, the game will end
        if(event.keyCode == 27){
            pause = true;
            window.clearTimeout(timePause);
            timePause = null;
            end();
        }
        /// when left key is pressed, the player will jump left by updating "m"
        if(event.keyCode == 37){
            if(!player.shouldJump) {
            player.spinIncrement = -90/32;
            m = -3;
            player.jumpCounter= 0;
            player.g++;
            for(var i=0; i<buildSquare.length; i++){
                buildSquare[i].colliding = false;
            }
            player.shouldJump= true;
            }
        }
    
         /// when right key is pressed, the player will jump right by updating "m"
        if(event.keyCode == 39){
            if(!player.shouldJump) {
            player.spinIncrement = 90/32;
            m = 3;
            player.jumpCounter= 0;
            player.g++;
            for(var i=0; i<buildSquare.length; i++){
                buildSquare[i].colliding = false;
            }
            player.shouldJump= true;
            }
        }
    }
    
    /// loops to draw and update each shape
    function animationLoop() {
    /// will only loop when pause is false
     if (!pause){
         /// clears screen using a rect layer
        clear();
        draw(player);
        circlePointDrawUpdate(buildCirclePoint);
        updateData(buildSquare,player,buildStartBox,buildPointShape,buildDownSquare,buildShape);
        squareDrawUpdate(buildSquare);
        // squaredownDrawUpdate(buildDownSquare);
        shapedrawUpdate(buildShape);
        pointDrawUpdate(buildPointShape);
        checkCollision(buildSquare, player, buildStartBox,buildDownSquare,buildShape);
        removeOutOfBounds();
        endGame(player);
        text();

        
        /// loops animationLoop
        requestAnimationFrame (animationLoop);
     }

    }
    function removeOutOfBounds() {
        // Iterate over each array and remove objects that are out of bounds
        removeOutOfBoundObjects(buildShape);
        removeOutOfBoundObjects(buildSquare);
        removeOutOfBoundObjects(buildDownSquare);
        removeOutOfBoundObjects(buildPointShape);
        removeOutOfBoundObjects(buildCirclePoint);
    }

    function removeOutOfBoundObjects(array) {
        // Iterate over the array and remove objects that are touching the bottom
        for (let i = array.length - 1; i >= 0; i--) {
            console.log(array)
            if (array[i].y > h) {
                array.splice(i, 1);
                console.log("spliced")
            }
        }
    }
    

    
    /// https://www.w3schools.com/tags/canvas_filltext.asp
    /// draws the score to the screen
    function text(){
        ctx.fillStyle = "white"
        ctx.font = "30px Roboto";
        ctx.fillText(score, w/2, 50);
    }
    
    /// Draws and updates points(dots) to the screen
    function pointDrawUpdate(o){
        for(var i=0; i<o.length; i++){
           pointsShape(o[i],o[i].s);
           pointCollision(o[i],player,buildCirclePoint);

           bottomRemove(o[i], buildPointShape);
        }
    }
    
    /// if the player collides with a dot, the dot will be spliced
    /// if the player is the same colour as the dot, a circle spiral sparkle effect will be called and the player gains one point towards the score
    function pointCollision(o,p,c){
        var index = 0;

        /// checks if collision is true
        if(collide(playerShape(p,p.s),pointsShape(o,o.s))) {

            /// splices dot
            index = buildPointShape.indexOf(o);
            buildPointShape.splice(index, 1);

            /// checking if the colour is the same
            if (p.c == o.c){
                // createCirclePoints(41);
                // /// spiral will be drawn for 29 loops
                // t = 30;
                // /// making sure the spiral effect is drawn from the x and y coordinates of the dot
                // for(var i=0; i<c.length; i++){
                //     c[i].x = o.x;
                //     c[i].y = o.y;
                //     c[i].c = o.c;
                // }

                
                // console.log("star colour is ,", o.c, "player colour is ,", p.c);
                // /// increasing score
                score++;
            }
        }
    }
    


    /// upon collision on a point of the same colour as the dot, t will equals to 30
    /// effect will be draw and updated using angle and forward, then t will decrease by 1
    /// when t is less then or equal to 0, nothing is drawn
    function circlePointDrawUpdate(o1) {
        if (t > 0) {
            for (var i = 0; i < o1.length; i++) {
                circlePointsShape(o1[i]);
                angle(o1[i], o1[i].m);
                forward(o1[i], o1[i].n);
            }
            t--;
        } else {
            // Create an array to store indices of elements to remove
            var indicesToRemove = [];
    
            // Find indices of elements to remove
            for (var i = 0; i < buildCirclePoint.length; i++) {
                if (buildCirclePoint[i] === o1) { // Assuming o1 is a unique object reference
                    indicesToRemove.push(i);
                }
            }
    
            // Remove elements from buildCirclePoint array in reverse order
            for (var j = indicesToRemove.length - 1; j >= 0; j--) {
                buildCirclePoint.splice(indicesToRemove[j], 1);
            }
        }
    }
    
    


    /// square moving upwards is drawn and updated
    /// setTimeout allows a new shape to be drawn after the set time
    /// if it is colliding with the player, the player object's angle,changle, and d properties will be updated to match the square object. 
    /// this allows both to move in the same direction and speed when colliding
    /// squares will bounce against the left and right sides of the canvas
    /// squares touching the bottom will be removed
    function squareDrawUpdate(o) {
        for(var i=0; i<o.length; i++){
            movingSquare = true;
    
            nshape(o[i],o[i].s);
            movingSquare = false;
    
            if (o[i].colliding){
                o[i].d = o[i].d*speed;
                forward(o[i]);
                player.angle = o[i].angle;
                player.changle = o[i].changle;
                player.d = o[i].d;
                forward(player);
                forward(player,0.2);
                player.d = 50;
                
    
            }
            /// to check if touching the left or right side
            bounce(o[i]);
            /// to check if touching bottom
            bottomRemove(o[i],buildSquare);
        }
    }
    



    /// square moving downwards is drawn and updated
    /// chance of a new object being added to the shape is randomized with a 1/200 chance each loop
    /// squares will bounce against the left and right sides of the canvas
    /// squares touching the bottom will be removed
    function squaredownDrawUpdate(o) {
    
    var create = randi(400)
    
    if (create == 5){
        createdownSquares(1)
    }
    
            for(var i=0; i<o.length; i++){
                movingSquare = true;
    
                nshape(o[i],o[i].s);
                movingSquare = false;
    
                if (o[i].colliding){
                    forward(o[i]);
                    player.angle = o[i].angle
                    player.changle = o[i].changle
                    player.d = o[i].d
                    forward(player);
                    // forward(player,0.2);
    
                }
                bounce(o[i]);
    
                bottomRemove(o[i],buildDownSquare)
            }
    }

    function shapedrawUpdate(o) {

        /// 
        var create = randi(200);
        
        if (create == 5){
            createShape(1);
        }
        
                for(var i=0; i<o.length; i++){
        
                    nshape(o[i],o[i].s);

                    bounce(o[i]);
        
                    bottomRemove(o[i],buildShape);
                }
        }
        

    /// moves and changes the speed of the shapes
    function updateData(sq,p,sb,ps,ds,sh){
        setNum = setNum/speed;
        move = move*speed;
        // p.jumpHeight = p.jumpHeight*speed
            // o1.y -= move
            for(var i=0; i<sq.length; i++){
                sq[i].y -= move;
                sq[i].d = sq[i].d * speed;
            }
            for(var i=0; i<ps.length; i++){
                ps[i].y -= move;
            }
            for(var i=0; i<ds.length; i++){
                ds[i].y -= move;
            } 
            for(var i=0; i<sh.length; i++){
                sh[i].y -= move;
            } 
            sb.y -= move;
            p.y -= move;
                
        
    }
    
        
    /// checks if the shapes are touching when the player is starting to jump downwards
    /// checking for collision after 19 frames of jumping allows the player to jump a little without being blocked by the shapes, in case of any problems that may occur if multiple shapes spawn at the same location. 
    /// when touching a shape and not a dot, the colour of the player will change to the colour of the shape
    function checkCollision(sq,p,sb,ds,sh) {

        /// checking if player is colliding with the upwards square shape
        if(p.jumpCounter > 19){
            for(var i=0; i<sq.length; i++){
                if(collide(playerShape(p,p.s),nshape(sq[i],sq[i].s))) {
                    shapePlayerCollide(sq[i],p);
                    p.c = sq[i].c;
                    sq[i].colliding = true;
                    // checkBounce(o[i], player);
                  }
                  else{
                    sq[i].colliding = false;
                  }
            }

            /// checking if player is colliding with the upwards square box drawn at the beginning
            /// a different collision function for two boxes is used here to demonstrate another method of collision
            if(squareCollision(p,sb)) {
                shapePlayerCollide(sb,p);
                p.c = sb.c;
                sb.colliding = true;
                p.angle = sb.angle;
                p.changle = sb.changle;
            }
              else {
                sb.colliding = false;
              }



            /// checking if player is colliding with the downwards square shape
            for(var i=0; i<ds.length; i++){


                if(collide(playerShape(p,p.s),nshape(ds[i],ds[i].s))) {
                    shapePlayerCollide(ds[i],p);
                    p.c = ds[i].c;
                    ds[i].colliding = true;
        
                  }
                  else{
                    ds[i].colliding = false;
                  }
            }
    

            /// checking if player is colliding with the regular shapes that do not move on collision
            for(var i=0; i<sh.length; i++){
                if(collide(playerShape(p,p.s),nshape(sh[i],sh[i].s))) {
                    shapePlayerCollide(sh[i],p);
                    p.c = sh[i].c;
                    sh[i].colliding = true;
                    p.angle = sh[i].angle;
                    p.changle = sh[i].changle;
        
        
                  }
                  else{
                    sh[i].colliding = false;
                  }
            }
        }
    

    
    }



    /// checks the collision of the player and the rect from the start
    /// demonstrates collision method for rect which was taught in class
    function squareCollision(p,sb){
   
       if(p.x+p.d/2+50 >= sb.x-sb.w/2 && /// right side o1 > left side o2 AND
           p.x-p.d/2 <= sb.x +sb.w/2 && /// left side o1 < right side o2 AND
           p.y+p.d/2 >= sb.y-sb.h/2 && // bottom of o1 > top of o2 AND
           p.y-p.d/2 <= sb.y+sb.h/2 /// top of o1 < bottom of o2
           ){
            //    console.log("yes")
               return true
           }else{
               console.log("no")
               return false
           }
   }
    
    /// intersect will check the sides of the shape to see if it is collinear
    /// if it is, then it will check for collision. If colliding, it returns true. If not colliding, then it will return false
    function collide(p1,p2) {
        for(var i=0; i<p1.s.length; i++) {
          for(var j=0; j<p2.s.length; j++) {
            var t = intersect(p1.s[i],p2.s[j]);
            if(t === 'collinear') {continue;}
            if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
            return true;
            }
          }
        }
        return false;
      }
      
      
    
    
    /// removes when shapes touch the bottom
    function bottomRemove(o,arr){
        var index = 0;

            if(o.y>h){
                // console.log("Removing object:", o);
                // console.log("Array before removal:", arr);
                index = arr.indexOf(o);
                if (index !== -1) {
                    arr.splice(index, 1);
                    // console.log("Object removed. Array after removal:", arr);
                }
                
        }
    }
    
    
    /// draws the player's shape and the box from the start
    function draw(o){
        player1 = jump(player);
        clear();
        playerShape(o,o.s);
        rect(buildStartBox);
    
    }
    


    /// creates jump animation through adjusting jump height using a counter, and the angle function
    /// variable "m" will determine if the shape will move left while jumping or right by changing the number on button click
    /// references this method https://codepen.io/LFCProductions/details/gOgZXEM
    function jump(o1) {
        if(o1.shouldJump){
    
            o1.jumpCounter++;
            if(o1.jumpCounter < 15){
                //Go up
                o1.y -= o1.jumpHeight;
                o1.x += m;
            }else if(o1.jumpCounter > 14 && o1.jumpCounter < 19){
                o1.y += 0;
                o1.x += m;
            }else if(o1.y < 1000){
                //Come back down
                o1.y += o1.jumpHeight;
                o1.x += m;
            }
                angle(o1,o1.spinIncrement);
                
        } else{
            gravityCollision(o1);
        }
    }
    

     /// if the player is colliding with the up square, shape or box from the start, it will move downwards slightly
     /// if not, it will move downwards quickly to mimic gravity
    function gravityCollision(o1){
        let result = false;
        for (let i = 0; i < buildSquare.length; i++) {
            if (buildSquare[i].colliding == true || buildStartBox.colliding == true) {
            o1.y += 0.1;
            result = true;
            break;
            }
        }
        for (let i = 0; i < buildShape.length; i++) {
            if (buildShape[i].colliding == true) {
                o1.y += 0.1;
            result = true;
            break;
            }
        }

        if (!result){
            o1.y += 2.5*speed;
        }
    }
    
    
    /// this function is called when some of the shapes collide with the player, so that the player will stop jumping, turning, and will move downwards slightly though "o2.colliding = true;"
    function shapePlayerCollide(o2,o1){
            o1.shouldJump = false;
            o1.spinIncrement = 0;
            o2.col = true;
            o2.colliding = true;
    
    }
    

 
    
    /// polygon collision https://gist.github.com/Code-Break0/229e23e687abbccca7611816f91d6e8b
    /// check if it is collinear
      function intersect(s1,s2) {
        if(((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)) === 0) {
          return 'collinear';
        }
        var tA =  ((s2[0].y - s2[1].y)*(s1[0].x - s2[0].x) + (s2[1].x - s2[0].x)*(s1[0].y - s2[0].y))/
                  ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)),
            tB =  ((s1[0].y - s1[1].y)*(s1[0].x - s2[0].x) + (s1[1].x - s1[0].x)*(s1[0].y - s2[0].y))/
                  ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y));
        return [tA, tB];
      }
    

      /// draws the dot shape and logs variables each time it is updated to check for collision
      function pointsShape(o,n){
    
        var points = [];
        var sides = []; // [[{x,y},{x,y}], ...]
        var max = {x:0,y:0};
        var min = {x:Infinity,y:Infinity};
      
        var obj = {"x": o.x, "y": o.y, "angle": o.angle, "d": o.side, "dis": o.d};
        var d = o.side/n;
        
        
        var turn = 360/n;
        var turn2 = 180-turn;
        var a = d/2*Math.tan(turn2/2*oneDegree);
        
        
      
        
        forward(o, d/2);
        angle(o, -90);
        forward(o, a);
        angle(o,90);
        
        
        ctx.beginPath();
        // ctx.moveTo(o.x,o.y);
        
        for(var i=0; i<n+1;i++){
      
            if(i === 0) {
              ctx.moveTo(o.x,o.y);
            }
            else {
      
              ctx.lineTo(o.x,o.y);
              sides.push([{x: points[i-1].x, y: points[i-1].y},{x: o.x, y: o.y}]);
            }
            if(o.x > max.x) {max.x = o.x;}
            if(o.y > max.y) {max.y = o.y;}
            if(o.x < min.x) {min.x = o.x;}
            if(o.y < min.y) {min.y = o.y;}
      
            points.push({x: o.x,y:o.y});
            angle(o, 360/n);
            forward(o,d);
            
        }
        ctx.closePath();
        points.pop();
    
    
    
        ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 1)";
        ctx.lineWidth = 5;
        ctx.stroke();
    
        ctx.shadowColor = "hsl("+o.c+", 100%, 50%, 0.9)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
        ctx.fill();
        o.side = d*n;
        
        o.x = obj.x; o.y = obj.y; o.angle = obj.angle, o.side = obj.d, o.d = obj.dis;
      
        return {p:points, s:sides,max,min};
        
      }
    


    /// draws the player shape and logs variables each time it is updated to check for collision
    function playerShape(o,n){

        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    
       
        var points = [];
        var sides = []; // [[{x,y},{x,y}], ...]
        var max = {x:0,y:0};
        var min = {x:Infinity,y:Infinity};
      
        var obj = {"x": o.x, "y": o.y, "angle": o.angle, "d": o.side, "dis": o.d};
        var d = o.side/n;
        
        
        var turn = 360/n;
        var turn2 = 180-turn;
        var a = d/2*Math.tan(turn2/2*oneDegree);
        
        
      
        
        forward(player, d/2);
        angle(player, -90);
        forward(player, a);
        angle(o,90);
        
        
        ctx.beginPath();
        // ctx.moveTo(o.x,o.y);
        
        for(var i=0; i<n+1;i++){
      
            if(i === 0) {
              ctx.moveTo(o.x,o.y);
            }
            else {
      
              ctx.lineTo(o.x,o.y)
              sides.push([{x: points[i-1].x, y: points[i-1].y},{x: o.x, y: o.y}])
            }
            if(o.x > max.x) {max.x = o.x;}
            if(o.y > max.y) {max.y = o.y;}
            if(o.x < min.x) {min.x = o.x;}
            if(o.y < min.y) {min.y = o.y;}
      
            points.push({x: o.x,y:o.y});
            angle(o, 360/n);
            forward(o,d);
            
        }
        ctx.closePath();
        points.pop();
        
    
        // ctx.shadowColor = "hsla("+o.c+", 100%, 50%,0.5)";
        // ctx.shadowBlur = 40;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;

        

        ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 0.6)";
        ctx.lineWidth = 5;
        ctx.stroke();
       
    
        o.side = d*n;
        
        o.x = obj.x; o.y = obj.y; o.angle = obj.angle, o.side = obj.d, o.d = obj.dis;
      
        return {p:points, s:sides,max,min};
        
    }



    /// clears screen using a rect layer
    function clear(){
        ctx.fillStyle = 'rgba(0,0,0, 1)';
        ctx.fillRect(0,0, w,h);






            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
    
    

    
    /// when the shape touches the wall, the angle function will be called to change the direction
    function bounce(o){
        if(o.x>w || o.x<0){
            angle(o,180-2*o.angle);
        }
      }
    


    /// draws the square shape from the start
    /// demonstrating another method of drawing a shape
      function rect(o){
            var x = o.x;
            var y = o.y;
            var a = o.angle;
            var d = o.d;
        
            angle(180);
            forward(o, o.w/2)
            angle(o,90);
            forward(o, o.h/2)
            angle(o,90);
        
        
            ctx.beginPath();
            ctx.moveTo(o.x,o.y);
            forward(o,o.w); /// updating x and y coor
            ctx.lineTo(o.x,o.y);
            angle(o, 90);
            forward(o, o.h);
            ctx.lineTo(o.x,o.y);
            angle(o, 90);
            forward(o, o.w);
            ctx.lineTo(o.x,o.y);
            angle(o, 90);
            forward(o, o.h);
            ctx.lineTo(o.x,o.y);
        
            ctx.closePath();
        
        
    
            ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 1)";
            ctx.lineWidth = 5;
            ctx.stroke();
        
            ctx.shadowColor = "hsl("+o.c+", 100%, 50%, 0.9)";
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        
           
        if (o.col){
            ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
            ctx.fill();
        }
        
            o.x = x;
            o.y = y;
            o.angle = a;
            o.d = d;
        
        
        }


    

    /// draws different types of shapes and logs points for collision each loop it is updated
    /// shapes will be coloured after colliding with the player by setting o.col to true
    /// on player collision it will glow (shadow)
    /// an additional for loop is used to check if the shape is a moving square. If it is, an arrow is drawn as well using angle and forwards
    /// the points of the arrow are not logged to check for collision
      function nshape(o,n){
    
        var points = [];
        var sides = []; // [[{x,y},{x,y}], ...]
        var max = {x:0,y:0};
        var min = {x:Infinity,y:Infinity};
      
        var obj = {"x": o.x, "y": o.y, "angle": o.angle, "d": o.side, "dis": o.d};
        var d = o.side/n;
        
        
        var turn = 360/n;
        var turn2 = 180-turn;
        var a = d/2*Math.tan(turn2/2*oneDegree);
        
        
      
        
        forward(o, d/2);
        angle(o, -90);
        forward(o, a);
        angle(o,90);
        
        ctx.beginPath();
        // ctx.moveTo(o.x,o.y);
        
        for(var i=0; i<n+1;i++){
      
            if(i === 0) {
              ctx.moveTo(o.x,o.y);
            }
            else {
      
              ctx.lineTo(o.x,o.y)
              sides.push([{x: points[i-1].x, y: points[i-1].y},{x: o.x, y: o.y}])
            }
            if(o.x > max.x) {max.x = o.x;}
            if(o.y > max.y) {max.y = o.y;}
            if(o.x < min.x) {min.x = o.x;}
            if(o.y < min.y) {min.y = o.y;}
      
            points.push({x: o.x,y:o.y});
            angle(o, 360/n);
            forward(o,d);
            
        }
        ctx.closePath();
        points.pop();
    
    
    
        ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 1)";
        ctx.lineWidth = 5;
        ctx.stroke();
    
        ctx.shadowColor = "hsl("+o.c+", 100%, 50%, 0.9)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    
       
    if (o.col){
        ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
        ctx.fill();
    }
    
    if(buildPointShape.isPoints){
        ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
        ctx.fill();
    }
    
    
    
    if (movingSquare){
        ctx.beginPath();
    
        angle(o,90);
        forward(o,d/2);
        forward(o,d/4);
        angle(o,90);
        forward(o,3*d/4);
        
        ctx.moveTo(o.x,o.y);
        
        // angle(o,90);
        angle(o, 120);
        forward(o,d/2);
        ctx.lineTo(o.x,o.y)
        angle(o, 120);
        forward(o,d/2);
        
        ctx.lineTo(o.x,o.y)
        
        
        angle(o, 120);
    }
    
    
    // ctx.closePath();
    // angle(o,-90);
    ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 1)";
    ctx.lineWidth = 5;
    ctx.stroke();
    
    
    
    
    
    
    
    
    
    
        o.side = d*n;
        
        o.x = obj.x; o.y = obj.y; o.angle = obj.angle, o.side = obj.d, o.d = obj.dis;
      
        return {p:points, s:sides,max,min};
        
      }
    
    /// pushes objects into an array for shapes facing downwards 
    /// using the remainder operator and array "moving", the direction of the shape will alternate  each time it is pushed
    /// "side" is randomized to change the size on spawn
    /// randColour will alternate between the colour array as well
      function createdownSquares(){

        mov++
    
        var moving = [90,45,135];
        const randColour = colour[Math.floor(Math.random() * colour.length)];
    
        buildDownSquare.push({
              "x": rand(w),
              "y": 0,
              "r": 40,
              "c": randColour,
              "a": 0.4,
              "d": 1.5,
              "side": rand(200)+300,
              "changle": 2,
              "angle": moving[mov%moving.length],
              "s": 4,
              "hex": false,
              "col": false,
              "colliding": false
        })
      }
    
    
    
    /// pushes objects into an array for shapes facing upwards
    /// using the remainder operator and array "moving", the direction of the shape will alternate each time it is pushed
    /// "c" will alternate between the colour array as well
    /// "side" is randomized to change the size on spawn
    /// using the remainder operator and array "xLocation", the placement of the shape will alternate each time it is pushed
    /// these locations are set so that there will never be a situation where it is impossible to continue playing (since other arrays push objects randomly)
      function createUpSquares(){
    
        var moving = [-30,210,-60,240];
        var xLocation = [rand(w)/6,5*w/6,2*w/6,4*w/6];
    
        
        
        for(var i=0; i<2; i++){
            alt++
            mov2++
            co++
            buildSquare.push({
              "x": xLocation[alt%xLocation.length],
              "y": 0,
              "r": 40,
              "c": colour[co%colour.length],
              "a": 0.4,
              "d": 1.5,
              "side": rand(200)+300,
              "changle": 2,
              "angle": moving[mov2%moving.length],
              "s": 4,
              "hex": false,
              "col": false,
              "colliding": false
            })
        }
    
        timePause = setTimeout(createUpSquares, setNum);
      }
    

        /// pushes objects into an array for shapes
        /// x, size, and s is randomized to change the size,x location, and number of sides on spawn
        /// "c" will alternate between the colour array as well
      function createShape(){
            buildShape.push({
                "x": rand(w),
                "y": 0,
                "r": 40,
                "c": colour[co%colour.length],
                "a": 0.4,
                "d": 1.5,
                "side": rand(200)+300,
                "changle": 2,
                "angle": 0,
                "s": randi(2)+2,
                "hex": false,
                "col": false,
                "colliding": false
            })
      }
    
    /// this function will push each object for the circle effect into the array
      function createPoints(){
          var n = rand(w)
        var xLocation = [n,n+100,n+200];
        const randColour = colour[Math.floor(Math.random() * colour.length)];
    
        for(var i=0; i<3; i++){
            
            buildPointShape.push({
            // "x" : xLocation[i%xLocation.length],
            "x": rand(h),
            "y" : -h/2,
            "c": randColour,
            "a": 0.5,
            "angle": 0,
            "changle": 15,
            "d":50,
            "side": 50,
            "col": false,
            "colliding": false,
            "s": 50,
            })
        }
        setTimeout(createPoints, setNum/2);
      }




    
    /// this function will push each object for the circle effect into the array
    function createCirclePoints(num){
        for(var i=0; i<num; i++){
            buildCirclePoint.push({
                "x": w/2,
                "y": h/2,
                "w": 20,
                "h": 15,
                "n": 10,
                "r": 6,
                "a": 0.9,
                "m":10,
                "v":20,
                "c":0,
                "angle": rand(360),
                "changle": 30,
                "d": randn(300),
            })
        }
    }
    
    
    


    
    /// this function will create the shape that will be used to create the circle effect
    /// arc is used here to demonstrate another method of drawing a shape
    function circlePointsShape(o){
            ctx.beginPath();
            ctx.moveTo(o.x, o.y);
            ctx.arc(o.x, o.y, o.r,0, Math.PI*2, true);
            ctx.lineTo(o.x,o.y);
            ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
            ctx.fill();
    }

       ///this function is called to draw the same, make each shape rotate as a whole, and be updated to turn the player to the same direction as the shape it touches on collision
      function angle(o,a){
        if(a != undefined){
          o.changle = a;
        };
        o.angle += o.changle;
      
      }
      

      
      /// similarly to the angle, this function is called to draw the shape, make it move as a whole and to move the player's shape to that it moves in the same direction as the squares
      function forward(o,d){
          var changeInx;
          var changeIny;
          
          if(d != undefined){
              o.d = d;
          };
          changeInx = o.d*Math.cos(o.angle*oneDegree);
          changeIny = o.d*Math.sin(o.angle*oneDegree);
          o.x += changeInx;
          o.y += changeIny;
      }
      
 
    
    
      /// when called, the parameter is multiplied by Math.random(), which returns a number inbetween 0 and the paramenter. 
      /// this number is then divided by 2.
      function randn(r){
          var result= Math.random()*r - r/2;
          return result
      }
      
      /// when called, this will return a random integer that is less or equal to the number
      function randi(r){
          var result = Math.floor(Math.random( )*r);
          return result
      }
      
      /// when called, the parameter is multiplied by Math.random(), which returns a number inbetween 0 and the paramenter. 
      function rand (r){
          var result = Math.random()*r;
          return result
      }
    
    
      /// canvas information
      function setUpCanvas (){
          canvas = document.querySelector("#myCanvas");
          ctx = canvas.getContext("2d");
          canvas.width = w;
          canvas.height = h;
          canvas.style.border = "4px solid #FFFFFF";
      }
      

      /// when the player collides with the bottom of the screen, the game will end
      function endGame(o){
        if (o.y>h){
            pause = true;
            window.clearTimeout(timePause);
            timePause = null;
            end();
            
            }    
        }




    
}



/// This function starts the game by changing the display of the start screen to none and canvas display to block. 
/// A private variable is used to store and draw onto the canvas
function startGame(){
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("end-screen").style.display = "none";
    rectStart = privateShape();
    document.getElementById("myCanvas").style.display = "block";

}    



/// when the game ends, myCanvas display will be hidden and the end screen will be shown with the final score. 
/// a button is shown under it to direct the player back to the start page (refreshes screen)
function end(){
    https://sebhastian.com/display-javascript-variable-html/
    document.getElementById("greeting").innerHTML = score;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("myCanvas").style.display = "none";
    document.getElementById("end-screen").style.display = "block";
}

function restart(){
    window.location.reload();
}

  //// NOTES


//   function build(o){
//     var x = o.x;
//     var y = o.y;
//     var a = o.angle;
//     var d = o.d;
  
//     /// centered
//     angle(120);
//     forward(o, o.w/2)
//     angle(o,60);
//     forward(o, o.w/2)
//     angle(o,60);
//     forward(o, o.w/2)
//     angle(o,60);
    
//     /// drawing the shape using angle and forward
//         ctx.beginPath();
  
//         ctx.moveTo(o.x,o.y);
//         forward(o,o.h);
//         ctx.lineTo(o.x,o.y);
//         angle(o, 60);
//         forward(o, o.h);
//         ctx.lineTo(o.x,o.y);
//         angle(o, 60);
//         forward(o, o.h);
//         ctx.lineTo(o.x,o.y);
//         angle(o, 60);
//         forward(o, o.h);
//         ctx.lineTo(o.x,o.y);
//         angle(o, 60);
//         forward(o, o.h);
//         ctx.lineTo(o.x,o.y);
//         angle(o, 60);
//         forward(o, o.h);
//         ctx.lineTo(o.x,o.y);

//         ctx.strokeStyle = "hsla("+o.c+", 100%, 50%, 1)";
//         ctx.lineWidth = 5;
//         ctx.stroke();
//     if (o.col){
//         ctx.shadowColor = "hsl("+o.c+", 100%, 50%)";
//         ctx.shadowBlur = 40;
//         ctx.shadowOffsetX = 0;
//         ctx.shadowOffsetY = 0;
//         ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
//         ctx.fill();
//     }

  
  
//     o.x = x;
//     o.y = y;
//     o.angle = a;
//     o.d = d;
  
  
//   }
  
  
//   function rect(o){
//       var x = o.x;
//       var y = o.y;
//       var a = o.angle;
//       var d = o.d;
  
//       angle(180);
//       forward(o, o.w/2)
//       angle(o,90);
//       forward(o, o.h/2)
//       angle(o,90);
  
  
//       ctx.beginPath();
//       ctx.moveTo(o.x,o.y);
//       forward(o,o.w); /// updating x and y coor
//       ctx.lineTo(o.x,o.y);
//       angle(o, 90);
//       forward(o, o.h);
//       ctx.lineTo(o.x,o.y);
//       angle(o, 90);
//       forward(o, o.w);
//       ctx.lineTo(o.x,o.y);
//       angle(o, 90);
//       forward(o, o.h);
//       ctx.lineTo(o.x,o.y);
//       ctx.fillStyle = "hsla("+o.c+", 100%, 50%,"+o.a+")";
//       ctx.fill();
  
  
//       o.x = x;
//       o.y = y;
//       o.angle = a;
//       o.d = d;
  
  
//   }
// function rect(o){
//     var x = o.x;
//     var y = o.y;
//     var a = o.angle;
//     var d = o.d;

//     angle(180);
//     forward(o, o.w/2)
//     angle(o,90);
//     forward(o, o.h/2)
//     angle(o,90);


//     ctx.beginPath();
//     ctx.moveTo(o.x,o.y);
//     forward(o,o.w); /// updating x and y coor
//     ctx.lineTo(o.x,o.y);
//     angle(o, 90);
//     forward(o, o.h);
//     ctx.lineTo(o.x,o.y);
//     angle(o, 90);
//     forward(o, o.w);
//     ctx.lineTo(o.x,o.y);
//     angle(o, 90);
//     forward(o, o.h);
//     ctx.lineTo(o.x,o.y);

//     ctx.closePath();


//     ctx.strokeStyle = "hsl("+o.c+", 100%, 50%,"+o.a+")";
//     ctx.lineWidth = 5;
//     ctx.stroke();

//     o.x = x;
//     o.y = y;
//     o.angle = a;
//     o.d = d;


// }

//   function nline(o,n){

//     var points = [];
//     var sides = []; // [[{x,y},{x,y}], ...]
//     var max = {x:0,y:0};
//     var min = {x:Infinity,y:Infinity};
  
//     var obj = {"x": o.x, "y": o.y, "angle": o.angle, "d": o.side, "dis": o.d};
//     var d = o.side/n;
    
    
//     var turn = 360/n;
//     var turn2 = 180-turn;
//     var a = d/2*Math.tan(turn2/2*oneDegree);
    
    
  
    
//     forward(o, d/2);
//     angle(o, -90);
//     forward(o, a);
//     angle(o,90);
    
    
//     ctx.beginPath();
//     // ctx.moveTo(o.x,o.y);
    
//     for(var i=0; i<n+1;i++){
  
//         if(i === 0) {
//           ctx.moveTo(o.x,o.y);
//         }
//         else {
  
//           ctx.lineTo(o.x,o.y)
//           sides.push([{x: points[i-1].x, y: points[i-1].y},{x: o.x, y: o.y}])
//         }
//         if(o.x > max.x) {max.x = o.x;}
//         if(o.y > max.y) {max.y = o.y;}
//         if(o.x < min.x) {min.x = o.x;}
//         if(o.y < min.y) {min.y = o.y;}
  
//         points.push({x: o.x,y:o.y});
//         angle(o, 360/n);
//         forward(o,d);
        
//     }
  
//     points.pop();



//     ctx.strokeStyle = "white";
//     ctx.lineWidth = 5;
//     ctx.stroke();

//     ctx.shadowColor = "hsl("+o.c+", 100%, 0%, 0.9)";
//     ctx.shadowBlur = 40;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
   

//     o.side = d*n;
    
//     o.x = obj.x; o.y = obj.y; o.angle = obj.angle, o.side = obj.d, o.d = obj.dis;
  
//     return {p:points, s:sides,max,min};
    
//   }


// function createLine(){
//     hue = Math.sin(hueRadians);


    
    
//     for(var i=0; i<randi(3); i++){
//         buildLine.push({
//           "x": rand(w),
//           "y": 0,
//           "w": rand(100)+100,
//           "h": 10,
//           "r": 40,
//           "c": 0,
//           "a": 0.5,
//           "d": 2,
//           "side": 300,
//           "changle": 2,
//           "angle": 0,
//           "s": 2,
//           "hex": false,
//           "colliding": false
//         })
//     }

//     hueRadians += 0.1;
//     setTimeout(createLine, 1000+rand(500));
//   }



    
// function lineDrawUpdate(o) {
//     for(var i=0; i<o.length; i++){
//         rect(o[i],o[i].s);
//         bottomRemove(o[i],buildLine)
//     }
// }