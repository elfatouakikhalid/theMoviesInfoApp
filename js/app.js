var pageNumber=1;
var trailerKey="";
var api="62ec76655885c74f4564fa53e16753e5";
var key="62ec76655885c74f4564fa53e16753e5";
document.getElementById('searchForm').addEventListener('submit',function(e){
    document.querySelector('.re').innerHTML='';
    var inputText=document.querySelector('#searchForm>input').value;
    document.getElementById('genres').innerHTML='';
    document.querySelector('#searchForm>input').value='';
    localStorage.setItem("inputSearch",inputText);
    e.preventDefault();
    pageNumber=1;
    loadMovies(inputText,pageNumber);
    var c=document.querySelector('form>input').style.display="none";
});
document.getElementById('showInput').addEventListener('click',function(){
    var c=document.querySelector('form>input');
    if(c.style.display=="inline"){
        c.style.display="none";
    }else{
        c.style.display="inline"
    }
});
document.getElementById('sideMenu').addEventListener('click',function(){
    var m=document.querySelector('body>div:first-of-type');
    var s=document.querySelector('.sideBar');
    if(m.style.marginLeft=="300px"){
        m.style.marginLeft="0px";
        s.style.left="-300px";
    }
    else{
        m.style.marginLeft="300px"
        s.style.left="0px";
    }
});
document.getElementById('closeMenu').addEventListener('click',function(){
    var m=document.querySelector('body>div:first-of-type');
    var s=document.querySelector('.sideBar');
    m.style.marginLeft="0px";
    s.style.left="-300px";
});
document.getElementById('results').addEventListener('click',function(e){
    if(e.target.id=='next'){
        if(pageNumber<localStorage.getItem("pages")){
            pageNumber++;
            loadMovies(localStorage.getItem("inputSearch"));
        }
    }
    if(e.target.id=='prev'){
        if(pageNumber>1){
            pageNumber--;
            loadMovies(localStorage.getItem("inputSearch"));
        }
    }
});
function loadMovies(inputText){
    var xhr=new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/search/movie?api_key='+api+'&language=en-US&query='+inputText+'&page='+pageNumber+'&include_adult=false',true);
    xhr.onload=function(){
        if(this.status==200){
            var movie=JSON.parse(this.responseText);
            localStorage.setItem("pages",movie.total_pages);
            var movies=movie.results;
            var output=`<p>Results:</p>
                        <div>`
            var name;
            for(var i in movies){
                name=movies[i].title;
                if(name.length>18&&movies[i].release_date!=undefined){
                    output+=`<div>
                    <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                    <h6>`+name.replace(name.slice(18,),'...')+`</h6>
                    <p>`+movies[i].release_date.slice(0,4)+`</p>
                    <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                    </div>`
                }
                else{
                    if(movies[i].release_date!=undefined){
                        output+=`<div>
                        <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                        <h6>`+name+`</h6>
                        <p>`+movies[i].release_date.slice(0,4)+`</p>
                        <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                        </div>`
                    } 
                }
            }
            output+=`</div>
            <p style="text-align: center;">Total number of pages : `+localStorage.getItem("pages")+`</p>
            <div id="navButtons">
                <input type="button" class="navBnInputs" id="prev" value="Prev">
                <input type="button" class="navBnInputs" id="Cpage" value="`+pageNumber+`">
                <input type="button" class="navBnInputs" id="next" value="next">
            </div>
            </div>
            `;
            document.getElementById('results').innerHTML=output;
        }
    }
    xhr.send();
}
window.onload=function(){
    loadPlaying('movie/now_playing','.pm');
    loadPlaying('tv/airing_today','.at');
}
function loadPlaying(path,classv){
    var xhr =new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/'+path+'?api_key='+api+'&language=en-US&page=1',true)
    xhr.onload=function(){
        if(this.status==200){
            var movie=JSON.parse(this.responseText);
            var moviePosters=movie.results;
            var output='';
            for(var i in moviePosters){
                output+=`<img src="https://image.tmdb.org/t/p/w500`+moviePosters[i].poster_path+`">`
            }
           document.querySelector(classv).innerHTML=output;
        }
    }
    xhr.send();
}
function SetId(id){
    localStorage.setItem('id',id);
}
function movieInfo(){
    var id=localStorage.getItem('id'); 
    getTrailer(id);
    var xhr= new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/movie/'+id+'?api_key='+api+'&language=en-US',true);
    xhr.onload=function(){
        if(this.status==200){
            var movie=JSON.parse(this.responseText);
            var genre='';
            document.getElementById('title').innerHTML=movie.title+`&nbsp;`+movie.release_date.slice(0,4);
            for(var g in movie.genres){
                genre+=movie.genres[g].name+' | ';
            }
            var output=`
                <div>
                    <img src="https://image.tmdb.org/t/p/w500`+movie.poster_path+`">
                </div>
                <div>
                    <iframe width="100%" height="400" src="https://www.youtube.com/embed/`+trailerKey+`" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div>
                    <br><br>
                    <h2>Rating: `+movie.vote_average+`</h2>
                    <br>
                    <h2>Genre: </h2><p>`+genre+`</p><br>
                    <h2>Storyline</h2>
                    <p>`+movie.overview+`</p>
                    <br><br><p>for more info such as cast, budget, runtime and more&nbsp;<span><a href="https://www.imdb.com/title/`+movie.imdb_id+`" target="_blank" >Click here</a></span></p>
                </div>
            `
            document.getElementById('movieInfo').innerHTML=output;
            trailerKey="";
        }
    }
    xhr.send();
}
function getTrailer(key){
    var xhr=new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/movie/'+key+'/videos?api_key='+api+'&language=en-US',true);
    xhr.onload=function(){
        if(this.status==200){
            var data=JSON.parse(this.responseText);
            var trailer=data.results;
            trailerKey=trailer[0].key;
        }
    }
    xhr.send();
}
function playing(number){
    var xhr =new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/movie/now_playing?api_key='+api+'&language=en-US&page='+number,true);
    xhr.onload=function(){
        if(this.status==200){
            var movie=JSON.parse(this.responseText);
            localStorage.setItem("numberpages",movie.total_pages);
            var movies=movie.results;
            var output=`<p>Now Playing Movies</p><div>`;
            var name;
            for(var i in movies){
                name=movies[i].title;
                if(name.length>18&&movies[i].release_date!=undefined){
                    output+=`<div>
                    <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                    <h6>`+name.replace(name.slice(18,),'...')+`</h6>
                    <p>`+movies[i].release_date.slice(0,4)+`</p>
                    <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                    </div>`
                }
                else{
                    if(movies[i].release_date!=undefined){
                        output+=`<div>
                        <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                        <h6>`+name+`</h6>
                        <p>`+movies[i].release_date.slice(0,4)+`</p>
                        <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                        </div>`
                    } 
                }
            }
            output+=`</div>
            <p style="text-align: center;">Total number of pages : `+localStorage.getItem("numberpages")+`</p>
            <div id="navButtons">
                <input type="button" class="navBnInputs" id="prev" value="Prev">
                <input type="button" class="navBnInputs" id="Cpage" value="`+number+`">
                <input type="button" class="navBnInputs" id="next" value="next">
            </div>
            </div>
            `;
            document.getElementById('results').innerHTML=output;
        }
    }
    xhr.send();
}
function airing(){
    var xhr=new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/tv/airing_today?api_key='+api+'&language=en-US&page='+number,true)
    xhr.onload=function(){
        if(this.status==200){
            var serie=JSON.parse(this.responseText);
            localStorage.setItem("numberPages",serie.total_pages);
            var series=serie.results;
            var output=`<p>Now Airing series</p><div>`
            var Sname;
            for(var i in series){
                Sname=series[i].name;
                if(Sname.length>18){
                    localStorage.setItem("tv_id",series[i].id);
                    output+=`<div><img src="https://image.tmdb.org/t/p/w500`+series[i].poster_path+`"><h6>`+Sname.replace(Sname.slice(18,),'...')+`</h6>
                    <p>`+series[i].first_air_date.slice(0,4)+`</p>
                    </div>`
                }
                else{
                    localStorage.setItem("tv_id",series[i].id);
                    output+=`<div><img src="https://image.tmdb.org/t/p/w500`+series[i].poster_path+`"><h6>`+Sname+`</h6>
                    <p>`+series[i].first_air_date.slice(0,4)+`</p>
                    </div>`
                }
            }
            output+=`</div>
            <p style="text-align: center;">Total number of pages : `+localStorage.getItem("numberPages")+`</p>
            <div id="navButtons">
                <input type="button" class="navBnInputs" id="prev" value="Prev">
                <input type="button" class="navBnInputs" id="Cpage" value="`+number+`">
                <input type="button" class="navBnInputs" id="next" value="next">
            </div>
            </div>
            `;
            document.getElementById('results').innerHTML=output;
        }
    }
    xhr.send();
}
//categories
var item=[...document.querySelectorAll("#navlist li")];
document.getElementById("action").addEventListener('click',function(){
    pageNumber=1;
    for(var i in item){
        if(item[i].classList.contains("activ")) item[i].classList.remove("activ");
    }
    document.getElementById("action").classList.add("activ");
    document.getElementById('genres').innerHTML='';
    document.querySelector('.re').innerHTML='';
    document.querySelector('#results').innerHTML='';
    localStorage.setItem("Genre","Action");
    localStorage.setItem("genreID","28")
    genre(28,"Action",pageNumber);
});
document.getElementById("drama").addEventListener('click',function(){
    pageNumber=1;
    for(var i in item){
        if(item[i].classList.contains("activ")) item[i].classList.remove("activ");
    }
    document.getElementById("drama").classList.add("activ");
    document.getElementById('genres').innerHTML='';
    document.querySelector('.re').innerHTML='';
    document.querySelector('#results').innerHTML='';
    localStorage.setItem("Genre","Drama");
    localStorage.setItem("genreID","18");
    genre(18,"Drama",pageNumber);
});
document.getElementById("fantasy").addEventListener('click',function(){
    pageNumber=1;
    for(var i in item){
        if(item[i].classList.contains("activ")) item[i].classList.remove("activ");
    }
    document.getElementById("fantasy").classList.add("activ");
    document.getElementById('genres').innerHTML='';
    document.querySelector('.re').innerHTML='';
    document.querySelector('#results').innerHTML='';
    localStorage.setItem("genreID","14");
    localStorage.setItem("Genre","Fantasy");
    genre(14,"Fantasy",pageNumber);
});
document.getElementById("comdey").addEventListener('click',function(){
    pageNumber=1;
    for(var i in item){
        if(item[i].classList.contains("activ")) item[i].classList.remove("activ");
    }
    document.getElementById("comdey").classList.add("activ");
    document.getElementById('genres').innerHTML='';
    document.querySelector('.re').innerHTML='';
    document.querySelector('#results').innerHTML='';
    localStorage.setItem("genreID","35");
    localStorage.setItem("Genre","Comedy");
    genre(35,"Comedy",pageNumber);
});

function genre(id,Dgenre,pageNumber){
    var xhr=new XMLHttpRequest();
    xhr.open('GET','https://api.themoviedb.org/3/movie/popular?api_key='+api+'&language=en-US&page='+pageNumber,true);
    xhr.onload=function(){
        if(this.status==200){
            var movie=JSON.parse(this.responseText);
            localStorage.setItem("pages",movie.total_pages);
            var movies=movie.results;
            var output=`<p>Popular `+Dgenre+` Movies</p><div>`
            var name;
            for(var i in movies){
                for(var j in movies[i].genre_ids){
                    if(movies[i].genre_ids[j]==id){
                        name=movies[i].title;
                        if(name.length>18&&movies[i].release_date!=undefined){
                            output+=`<div>
                            <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                            <h6>`+name.replace(name.slice(18,),'...')+`</h6>
                            <p>`+movies[i].release_date.slice(0,4)+`</p>
                            <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                            </div>`
                        }
                        else{
                            if(movies[i].release_date!=undefined){
                                output+=`<div>
                                <img src="https://image.tmdb.org/t/p/w500`+movies[i].poster_path+`">
                                <h6>`+name+`</h6>
                                <p>`+movies[i].release_date.slice(0,4)+`</p>
                                <a href="moreInfo.html" target="_blank" onclick="SetId(`+movies[i].id+`)">More info..</a>
                                </div>`
                            } 
                        }
                    }
                }
            }
            output+=`</div>
            <p style="text-align: center;">Total number of pages : `+localStorage.getItem("pages")+`</p>
            <div id="navButtons">
                <input type="button" class="navBnInputs" id="prev" value="Prev">
                <input type="button" class="navBnInputs" id="Cpage" value="`+pageNumber+`">
                <input type="button" class="navBnInputs" id="next" value="next">
            </div>
            </div>
            `;
            document.getElementById('genres').innerHTML=output;
        }
    }
    xhr.send();
}
document.getElementById('genres').addEventListener('click',function(e){
    if(e.target.id=='next'){
        if(pageNumber<localStorage.getItem("pages")){
            pageNumber++;
            genre(localStorage.getItem("genreID"),localStorage.getItem("Genre"),pageNumber);
        }
    }
    if(e.target.id=='prev'){
        if(pageNumber>1){
            pageNumber--;
            genre(localStorage.getItem("genreID"),localStorage.getItem("Genre"),pageNumber);
        }
    }
});
var xPos = null;
var yPos = null;
document.addEventListener( "touchmove", function ( e ) {
    e.preventDefault();
} );