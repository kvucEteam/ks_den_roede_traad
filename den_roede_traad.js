

// kpNo = keyProblemNo
// pfNo1 = problemFormulation1
// pfNo2 = problemFormulation2
function step_1_template(kpNo, pfNo1, pfNo2) {
	var JD = jsonData.data[kpNo];
	var stepNo = 1;
	var HTML = '';
	HTML += '<h1>'+jsonData.steps[stepNo-1].header+': '+jsonData.data[kpNo].keyProblem+'</h1>';
	HTML += instruction(jsonData.steps[stepNo-1].instruction);
	HTML += '<div id="step_1_template">';	
	HTML += 	'<div id="cardAndWasteWrap" class="col-xs-12 col-md-4">';
	HTML += 		'<div id="cardPile" class="col-xs-6 col-md-12">';
	HTML += 				'UNDERSPØRGSMÅL';
	HTML += 			getCardPile(kpNo, pfNo1, pfNo2);
	HTML += 		'</div>';
	HTML += 		'<div class="col-xs-6 col-md-12">';
	HTML += 			'<div class="wasteBinHeading">';
	HTML += 				'PASSER IKKE IND';
	HTML += 			'</div>';
	HTML += 			'<div id="wasteBin">';
	HTML += 				'<span class="glyphicons glyphicons-bin">&nbsp; </span>';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 	'</div>';
	HTML += 	'<div class="hidden-md hidden-lg spacer">&nbsp;</div>';
	HTML += 	'<div class="col-xs-12 col-md-8">';
	HTML += 		'<div id="problem_0" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				'PROBLEMFORMULERING: '+JD.problemformulations[pfNo1].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_0" class="dropZone">';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 		'<div id="problem_1" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				'PROBLEMFORMULERING: '+JD.problemformulations[pfNo2].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_1" class="dropZone">';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 	'</div>';
	HTML += '</div>';
	$('#DataInput').html(HTML);

}


function getProblemFormulations(kpNo, pfNo1, pfNo2){
	var JD = jsonData.data[kpNo];
	$('#problem_1').html(JD.problemformulations[pfNo1].problemformulation);
	$('#problem_2').html(JD.problemformulations[pfNo2].problemformulation);
}


function lableDraggabels(){
	for (var n in jsonData.data) {
		for (var m in jsonData.data[n].problemformulations) {
			for (var t in jsonData.data[n].problemformulations[m].subQuestions) {
				if (jsonData.data[n].problemformulations[m].subQuestions[t].correct) {
					jsonData.data[n].problemformulations[m].subQuestions[t].dropClass = 'problem_'+m;
				} else {
					jsonData.data[n].problemformulations[m].subQuestions[t].dropClass = 'wasteBin';
				}
			}
		}
	}
	console.log('lableDraggabels - jsonData: ' + JSON.stringify(jsonData));
}


function getCardPile(kpNo, pfNo1, pfNo2){
	var JD = jsonData.data[kpNo];
	var subQuestions = JD.problemformulations[pfNo1].subQuestions.concat(JD.problemformulations[pfNo2].subQuestions);
	console.log('subQuestions: ' + JSON.stringify(subQuestions, null, 4));
	var HTML = '';
	for (var n in subQuestions) {
		HTML += '<div id="card_'+n+'" class="card '+subQuestions[n].dropClass+'">'+subQuestions[n].subQuestion+'</div>';
		// if (n == 3) break;
	}
	return HTML;
}


function organizeCardPile(parentContainer, hideAboveNo, marginTop) {  // <------- "marginTop" is currently not in use....
	var margin = 30;
	console.log('organizeCardPile - parentContainer: ' + parentContainer);
	$( parentContainer+" .card" ).each(function( index, element ) {
		margin -= (index <= hideAboveNo)? 5 : 0;
		index += (parentContainer.indexOf('cardPile') !== -1)? $( parentContainer+" .card" ).length : 0 ;  // This makes sure that the z-index of the #cardPile is alway higher than th dropzones.
		
		// $(element).css({"position": "absolute", "top": String(margin)+'px', "left": String(margin)+'px', "z-index": index, "margin-top": marginTop+'%'});
		var pcOffset = $(parentContainer).offset();
		var pcPosition = $(parentContainer).position();
		console.log('organizeCardPile - pcOffset: ' + JSON.stringify(pcOffset));
		console.log('organizeCardPile - pcPosition: ' + JSON.stringify(pcPosition));
		$(element).css({"position": "absolute", "top": String(margin+pcPosition.top)+'px', "left": String(margin+10)+'px', "z-index": index, "margin-top": marginTop+'%'});
		
	}); 
}

// IMPORTANT: Class "draggable" (and NOT clases: "ui-draggable", "ui-draggable-handle" and "ui-draggable-dragging") makes all the problems of cloning from ouside and into a droppable.
function SimpleClone(TargetSelector) {
    var Clone = $(TargetSelector).clone().removeClass("draggable").css({
        'position': 'absolute',
        'top': 'auto',
        'left': 'auto',
        'height': 'auto', // <---- NEW
        'width': '80%'    // <---- NEW
    }); // This is necessary for cloning inside the droppable to work properly!!!
    Clone = Clone.removeAttr("id").removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    // Clone = Clone.addClass("Clone");
    return Clone;
}

function step_2_template_OLD() {
	var HTML = '';
	HTML += '<div id="step_2_template">';
	HTML += '</div>';
	$('#DataInput').html(HTML);
}


function step_2_template() {
	// $('.problem .card').css({"position": "relative", "top": 'auto', "left": 'auto', "z-index": 0},1000);   // VIRKER  OK - men er visuelt ikke appelerende...

	$('.dropZone' ).each(function( index1, element1 ) {
		console.log('step_2_template - each dropZone: ' + $(element1).prop('id'));
		var height = 0; var pt = 0; var pb = 0;
		$('.card', element1 ).each(function( index2, element2 ) {
			console.log('step_2_template - each id: ' + $(element2).prop('class'));
			pt += parseInt($(element2).css('padding-top').replace('px',''));
			pb += parseInt($(element2).css('padding-bottom').replace('px',''));
			console.log('step_2_template - pt: ' + pt + ' pb: ' + pb);
			height += $(element2).height(); // + pt + pb;
			console.log('step_2_template - height: ' + height);
			$(element2).switchClass( "card", "sortable_text_container", 400, "easeInOutQuad" );
			$(element2).animate({top: String(height+pt+pb)+'px', left: '30px'}, 500, function(){  // When the animation is complete, do...
				$(element2).css({position: 'relative', top: 'auto', left: 'auto'});
				// $(element2).switchClass( "card", "sortable_text_container", 1000, "easeInOutQuad" );  // Switch class from card-style to sortable style - SEE:  http://api.jqueryui.com/switchclass/
				$(element2).attr('style','');  // Remove leftover styling from the animate function
			});
		});
		$( element1 ).switchClass( "dropZone", "sortableZone", 200 );  // SEE:  http://api.jqueryui.com/switchclass/
	});

	// makeSortable('.sortableZone'); // <---- Class selector does not work - it has to be more specific
	makeSortable('#dropZone_0');
	makeSortable('#dropZone_1');
	$('#cardAndWasteWrap').html('<span id="checkAns_step2" class="btn btn-lg btn-primary"> TJEK </span>');
	$('#checkAns_step2').hide();
	$('#checkAns_step2').fadeIn('slow');
}

function makeSortable(targetContainer) {
	// Sort function are placed here due to readiness issues of the DOM:
	$( targetContainer ).sortable({
		axis: 'y',
		sortAnimateDuration: 500,
	    sortAnimate: true,
	    distance: 25,
	    update: function(event, ui) {
	    	console.log('makeSortable - UPDATE');
	    	// updateSortableOrderArray(2);
	    	// $( "#subjectSentenceSortableContainer" ).sortable( "refresh" );  // "Refresh" anvende ikke således.
	    	// repositionBarHeight();
	    	// colorSubQuestions();
	    },
	    start: function(event, ui) {
	    	console.log('makeSortable - START');
	        console.log('makeSortable - ui.item.index: ' + ui.item.index());
	    },
	    stop: function(event, ui) {
	        console.log('makeSortable - STOP');
	    }
	});
}


function step_3_template() {
	var HTML = '';
	HTML += '<div id="step_3_template">';
	HTML += '</div>';
	$('#DataInput').html(HTML);
}


function returnCardObj(kpNo, pfNo1, pfNo2){
	var JD = jsonData.data[kpNo];
	var subQuestions = JD.problemformulations[pfNo1].subQuestions.concat(JD.problemformulations[pfNo2].subQuestions);
}


$(document).ready(function() {
	lableDraggabels();
	console.log('jsonData: ' + JSON.stringify(jsonData));
	step_1_template(0, 0, 1);
	// step_1_template(1, 0, 1);
	organizeCardPile('#cardPile',5, 10);

	enable_audio();

	window.dropZoneObj = null;


	$( ".card" ).draggable({
		revert: 'invalid',
		start: function(event, ui) {
			console.log('card - START');
		},
		stop: function(event, ui) {
			console.log('card - STOP');

			if (dropZoneObj !== null){ // If student answer is correct...
				var dropId = $(dropZoneObj).prop('id');
				console.log('card - dropId: ' + dropId);

				$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
				$(this).remove();												// Remove the original card
				organizeCardPile('#'+dropId, 5, 0);
				
				// if (dropId == 'wasteBin') {
				// 	$('.glyphicons-bin').css({'opacity':'0'});
				// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
				// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
				// } 

				dropZoneObj = null;  // Reset dropZoneObj...

				correct_sound();
			} else {  // If student answer is wrong...
				error_sound();
			}

			if ($('#cardPile .card').length == 0) {
				console.log('step_2_template - INIT');
				step_2_template();
			}

		},
		drag: function(event, ui) {
			console.log('card - DRAG');
		}
	});
	$( "#dropZone_0" ).droppable({
		accept: ".problem_0",

		drop: function(event, ui) {
			console.log('card - DROP - problem_0');
			window.dropZoneObj = $(this);
		} 
	});
	$( "#dropZone_1" ).droppable({
		accept: ".problem_1",
		drop: function(event, ui) {
			console.log('card - DROP - problem_1');
			window.dropZoneObj = $(this);
		}  
	});
	$( "#wasteBin" ).droppable({
		accept: ".wasteBin",
		drop: function(event, ui) {
			console.log('card - DROP - wasteBin');
			window.dropZoneObj = $(this);
		}  
	});
});