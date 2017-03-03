$('#polloptions').change(function(){
    if($('#polloptions').val()=='-1' && $('#customopt').val()==''){
        $('#btnsub').prop('disabled', true);
    }else{$('#btnsub').prop('disabled', false);}
});

$('#customopt').change(function(){
    if($('#polloptions').val()=='-1' && $('#customopt').val()==''){
        $('#btnsub').prop('disabled', true);
    }else{$('#btnsub').prop('disabled', false);}
});

if(loguser!=undefined){
    $('#customopt').attr({'placeholder': 'Add a custom option'});
    $('#customopt').prop('readonly',false);
    $('#customopt').change(function(){
       $('#polloptions option').each(function(){$(this).removeAttr('selected')});
       $('#polloptions').val('-1');
       $("#polloptions option:first").attr('selected','selected');
    });
    $('#polloptions').change(function(){
       $('#customopt').val(''); 
    });
    
}
