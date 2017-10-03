
function shineLinks_right(id){
 try{
   var el=document.getElementById(id).getElementsByTagName('a');
   var url=document.location.href;

   for(var i=0;i<el.length; i++){
	if (url==el[i].href){
		el[i].parentNode.className = 'active';
	};
   };
 }catch(e){}

}














