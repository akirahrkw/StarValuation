/**
 * StarValuation Javascript Library
 * 
 * Copyright (C) 2011 Akira Hirakawa
 * Licensed under the MIT license
 * Date: 2011-02-08
 * @author Akira Hirakawa <http://www.akirahrkw.com>
 * @version 1.0.0
 */
var SV = (function(jQuery){
	
	var options = {
		num: 5,
		hoverImg : "./img/star_hover.png",
		unhoverImg : "./img/star_unhover.png",
		hoverCss : null,
		unhoverCss : null,
		size : 20,
		onclick : null
	};
	
	var array = [];
	
	var Line = function(id,point,stat)
	{
		this.id = id;
		this.point = (point != null) ? point : 0 ;
		this.stat = (stat != null) ? stat : false ;
		this.stars = [];
		this.init();
	}
	
	Line.prototype = {
		init : function()
		{
			for(var i=1; i<= options.num; i++)
			{
				this.stars[i] = new Star(this,i);
			}
		},
		html : function()
		{
			var frag = document.createDocumentFragment();
			for(var i=1; i<= options.num; i++){
				frag.appendChild(this.stars[i].html());
			}
			return frag; 
		},
		event : function()
		{
			if(this.stat){ return ; }
			for(var i=1; i <= options.num; i++){
				this.stars[i].event();	
			}
		},
		update : function(pos,updated)
		{
			if(updated){ this.point = pos; }
			for(var i=1; i <= options.num; i++)
			{
				(i <= pos) ? this.stars[i].hover() : this.stars[i].unhover();
			}
		},
		block : function()
		{
			$("#" + this.id).unbind();
			for(var i=1; i <= options.num; i++){
				this.stars[i].block();	
			}
		},
		unblock : function()
		{
			for(var i=1; i <= options.num; i++){
				this.stars[i].unblock();	
			}
		}
	};
	
	var Star = function(parent,pos)
	{
		this.parent = parent;
		this.id = this.parent.id + "_" + pos;
		this.pos = pos;
		this.clicked = false;
		this.odd ;
		this.even ;
	}
	
	Star.prototype = 
	{
		html : function()
		{
			var frag = document.createDocumentFragment();
			
			var img = document.createElement("img");
			img.id = this.id + "_even";
			img.src =  options.hoverImg;
			img.className = options.hoverCss ;
			img.width = img.height = options.size;
			img.style.display = "inline";
			
			var img2 = document.createElement("img");
			img2.id = this.id + "_odd";
			img2.src = options.unhoverImg;
			img2.className = options.unhoverCss ;
			img2.width = img2.height = options.size;
			img2.style.display = "none";
			
			frag.appendChild(img);
			frag.appendChild(img2);
			
			return frag;
		},
		event : function()
		{
			this.even = $("#" + this.id + "_even").addClass(options.hoverCss);
			this.odd = $("#" + this.id + "_odd").addClass(options.unhoverCss);
			this._event(this.even);
			this._event(this.odd);
		},
		_event : function(elem)
		{
			var self = this;
			elem.mouseover(function(){
				if(self.clicked){
					self.clicked = false;
					return;
				}
				self.parent.update(self.pos,false);	
			}).mouseout(function(){
				self.parent.update(self.parent.point,false);
			}).click(function(e){
				self.clicked = true;
				if(self.parent.point == self.pos){
					self.parent.update(0,true);
				}else{
					self.parent.update(self.pos,true);
				}
			});
			
			if(options.onclick != null){ elem.click(options.onclick); }
			
		},
		hover : function()
		{	
			this.even.css("display","inline");
			this.odd.css("display","none");
		},
		unhover : function()
		{
			this.even.css("display","none");
			this.odd.css("display","inline");
		},
		block : function()
		{
			this.even.unbind();
			this.odd.unbind();
		},
		unblock : function(){
			this.event();
		}
	};
	
	jQuery.fn.attach = function(point,stat)
	{
		return this.each(function()
		{
			array[this.id] = new Line(this.id,point,stat);
			$(this).append(array[this.id].html());
			array[this.id].event();
			array[this.id].update(point,true);
		});
	};

	jQuery.fn.point = function()
	{
		var point = [];
		var id;
		this.each(function(){ id = this.id ; point[this.id] = array[this.id].point; });
		
		if(this.size() == 1){
			return point[id];
		}else{
			return point;
		}
	};

	jQuery.fn.block = function()
	{
		return this.each(function(){
			array[this.id].block();
		});
	};
	
	jQuery.fn.unblock = function()
	{
		return this.each(function(){
			array[this.id].unblock();
		});
	};
	
	return {
		version : "1.0.0",
		init : function(opt){
			options = jQuery.extend(options,opt);
		}
	};
	
})(jQuery);