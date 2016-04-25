

// kpNo = keyProblemNo
// pfNo1 = problemFormulation1
// pfNo2 = problemFormulation2
function step_1_template(kpNo, pfNo1, pfNo2) {
	var JD = jsonData.data[kpNo];
	var stepNo = 1;
	var HTML = '';
	HTML += '<h1>'+jsonData.steps[stepNo-1].header+'</h1>';
	HTML += instruction(jsonData.steps[stepNo-1].instruction);
	HTML += '<div id="step_1_template">';	
	HTML += 	'<div class="col-xs-12 col-md-4">';
	HTML += 		'<div id="cardPile" class="col-xs-6 col-md-12">';
	HTML += 				'UNDERSPØRGSMÅL';
	HTML += 			getCardPile(kpNo, pfNo1, pfNo2);
	HTML += 		'</div>';
	HTML += 		'<div id="wasteBin"  class="col-xs-6 col-md-12">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				'PASSER IKKE IND';
	HTML += 			'</div>';
	// HTML += 			'<div id="dropZone_wasteBin">';
	HTML += 				'<span class="glyphicons glyphicons-bin">&nbsp;</span>';
	// HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 	'</div>';
	HTML += 	'<div class="col-xs-12 col-md-8">';
	HTML += 		'<div id="problem_0" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				JD.problemformulations[pfNo1].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_0">';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 		'<div id="problem_1" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				JD.problemformulations[pfNo2].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_1">';
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

function step_2_template() {
	var HTML = '';
	HTML += '<div id="step_2_template">';
	HTML += '</div>';
	$('#DataInput').html(HTML);
}

function step_3_template() {
	var HTML = '';
	HTML += '<div id="step_3_template">';
	HTML += '</div>';
	$('#DataInput').html(HTML);
}


$(document).ready(function() {
	lableDraggabels();
	console.log('jsonData: ' + JSON.stringify(jsonData));
	step_1_template(0, 0, 1);
	organizeCardPile('#cardPile',5, 10);

	window.dropZoneObj = null;


	$( ".card" ).draggable({
		revert: 'invalid',
		start: function(event, ui) {
			console.log('card - START');
		},
		stop: function(event, ui) {
			console.log('card - STOP');

			if (dropZoneObj !== null){
				var dropId = $(dropZoneObj).prop('id');
				console.log('card - dropId: ' + dropId);

				if (dropId != 'wasteBin') {
					$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
					// $('#'+dropId+' .card').last().css({'position':'relative','top':'0px','left':'0px'});
					$(this).remove();												// Remove the original card
					organizeCardPile('#'+dropId, 5, 0);
				} else {
					$(this).fadeOut( "slow", function() {
						$(this).remove();
					});
				}
				dropZoneObj = null;
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