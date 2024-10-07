$(document).ready(function(){
    $("#add-event-kommantar").click(function(){
      var x = $("#Kommantar").serializeArray();
      $.each(x, function(i, field){
        $("#View_kommantar").prepend(


              "<li>"+ field.value + "</li>" 



            );
            console.log(x)
        console.log(x[0].value)
     

      });
    });



  });