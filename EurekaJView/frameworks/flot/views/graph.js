// ==========================================================================
// Project:   Flot.GraphView
// Copyright: ©2010 Bo Xiao <mail.xiaobo@gmail.com>, Inc.
// ==========================================================================
/*globals Flot */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

sc_require('core.js');

Flot.GraphView = SC.View.extend(
/** @scope Flot.GraphView.prototype */ {
	series: null,
	data: null ,
	options: null,
	debugInConsole: false ,
	previousPoint: null,
	showTooltip: false,
	
	render: function(context, firstTime) {
		sc_super();
		if( !this.get('layer') || ! this.get('isVisibleInWindow')) return;

		if((this.get('frame').width <= 0) || (this.get('frame').height <= 0)) return;

		if( ($(this.get('layer')).width() <= 0)
				|| ($(this.get('layer')).height() <= 0)) return;

		var data = this.get('data'),
		series = this.get('series');
		var options = {"xaxis": {"mode": "time"}, "yaxis": {"min": 0}, "series": {"lines": { "show": true }, "points": { "show": true }}, "grid": { "hoverable": true, "clickable": true }, "crosshair": { "mode": "x" },};
		
		if (!SC.empty(data)) {
		if (this.debugInConsole) console.log(this.get('layer'));
			Flot.plot(this.get('layer'), data.toArray(),
				options);
			if (this.debugInConsole) console.log('render data');
		} else if (!SC.empty(series)) {
			Flot.plot(this.get('layer'), series.toArray(),
				this.get('options'));
			if (this.debugInConsole) console.log('render series');
		} else {
			if (this.debugInConsole) console.warn('data was empty');
		}
		if (this.showTooltip) {
		    $("#sc482").bind("plothover", function (event, pos, item) {
		        $("#x").text(pos.x.toFixed(2));
		        $("#y").text(pos.y.toFixed(2));

		            if (item) {
		                if (previousPoint != item.datapoint) {
		                    previousPoint = item.datapoint;

		                    $("#tooltip").remove();
		                    var x = item.datapoint[0].toFixed(2),
		                        y = item.datapoint[1].toFixed(2);
							var contents = item.series.label + " = " + y;
							
		                    	 $('<div id="tooltip">' + contents + '</div>').css( {
							            position: 'absolute',
							            display: 'none',
							            top: item.pageY + 5,
							            left: item.pageX + 5,
							            border: '1px solid #fdd',
							            padding: '2px',
							            'background-color': '#fee',
							            opacity: 0.80
							        }).appendTo("body").fadeIn(200);
		                }
		            }
		            else {
		                $("#tooltip").remove();
		                previousPoint = null;            
		            }
		    });
		}
	},
	
    plotDataDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('data changed');
	}.observes('.data','.data.[]'),
    
    plotSeriesDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('series changed');
	}.observes('.series','.series.[]'),
	
    plotOptionsDidChange: function() {
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('options changed');	
	}.observes('.options', '.options.[]'),
	
    visibilityDidChange: function() {
		if(this.get('isVisibleInWindow') && this.get('isVisible')) {
			if (this.debugInConsole) console.log('visibility changed');
			this.setLayerNeedsUpdate() ;
		}		
	}.observes('isVisibleInWindow','isVisible'),
	
    layerDidChange: function() {
		if (this.debugInConsole) console.log('layerchanged');
		this.setLayerNeedsUpdate() ;	
	}.observes('layer'),
	
    layoutDidChange: function() {
		sc_super();
		if (this.debugInConsole) console.log('layout changed');
		this.setLayerNeedsUpdate() ;
	},
	
    updateLayerLocationIfNeeded: function() {
		var ret = sc_super() ;
		if (this.debugInConsole) console.log('layer location update');
		this.setLayerNeedsUpdate() ;
		return ret;
	},
	
    setLayerNeedsUpdate: function() {
		this.invokeOnce(function() {
			this.set('layerNeedsUpdate', YES);
			if (this.debugInConsole) console.log('need update') ;
		});
	},
	
    viewDidResize: function() {
		sc_super();
		this.setLayerNeedsUpdate() ;
		if (this.debugInConsole) console.log('view did resize');
	}.observes('layout'),
	
	
    parentViewDidResize : function() {
		sc_super();
		this.setLayerNeedsUpdate();
		if (this.debugInConsole) console.log('parent did resize');
	}

});