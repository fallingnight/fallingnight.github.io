var piclist=document.getElementsByClassName('pic_slider');
var titlelist=document.getElementsByClassName('titlelist');
var textlist=document.getElementsByClassName('pic_text');
var pagelist=document.getElementsByClassName('k');
var left=document.getElementById('left');
var right=document.getElementById('right');
var leftlink=document.getElementsByClassName('leftlink');
var rightlink=document.getElementsByClassName('rightlink');

var j=0;
var i=0;
var prev=0;
var step=0;

right.onclick=function (){
	prev=step;    
	step++;    
	if(step>=piclist.length){
		step=0;
	}
	change();
}
left.onclick=function (){
	prev=step;    
	step--;    
	if(step<0){
		step=piclist.length-1;
	}
	change();
}


for(j=0;j<pagelist.length;j++){
	const listidx=j;
	pagelist[j].onclick=function (){
		const thisStep=listidx;
		prev=step;    
		step=thisStep;
		change();
	}
}

function change(){    
    piclist[prev].style.zIndex = '0';    
	piclist[prev].style.opacity = '0';       
	piclist[step].style.zIndex = '1';    
	piclist[step].style.opacity = '1';
	piclist[step].style.transition = 'opacity .5s';
	focus();
	title();
	text();
	document.querySelector('.page-input').value = step+1;
}

function focus(){    
for(i=0;i<pagelist.length;i++){
	if(i==step){
		pagelist[i].className='active k';
	}else{
		pagelist[i].className='k';
	}
}
}

function title(){
	titlelist[prev].style.display='none';
	titlelist[step].style.display='block';
}

function text(){
	textlist[prev].style.display='none';
	textlist[step].style.display='block';
	
}
for(j=0;j<rightlink.length;j++){
rightlink[j].onclick=function (){
	prev=step;    
	step++;    
	if(step>=piclist.length){
		step=0;
	}
	change();
}
}
	

for(j=0;j<leftlink.length;j++){
leftlink[j].onclick=function (){
	prev=step;    
	step--;    
	if(step<0){
		step=piclist.length-1;
	}
	change();
}
}

document.querySelector('.page-input').addEventListener('input', function(e) {
    const inputValue = parseInt(this.value);
    if (!isNaN(inputValue)) {
		const thisStep=inputValue-1;
		if(thisStep<=pagelist.length){
			prev=step;    
			step=thisStep;
			change();
		}
    }
});