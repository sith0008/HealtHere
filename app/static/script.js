let qs = ["Unresponsive_3", "Hard to breathe_3", "Facial drooping_2", "Arm weakness_1", "Speech difficulty_2", "Headache_0", "Abdominal Pain_0"];

let key = "AIzaSyBRVGwYP5aqwyJ9gYB3KLep1kd75Xel5Ro";

let result = [null, null, null];
let val = 0;

function display(geo) {
    let coord = String(geo.name);
    map = document.createElement("iframe");
    map.id = "map";
    map.style = "height: 400px; width: 100%;"
    console.log(geo);
    map.src = "https://www.google.com/maps/embed/v1/place?key="+key+"&zoom=18&q="+coord;
    document.getElementById("questions").appendChild(map);
}

function success(pos) {
    result[0] = '('+String(pos.coords.latitude)+','+String(pos.coords.longitude)+')';
    // send result array to server
    result = JSON.stringify(result);

    // request(result);

    console.info(result);
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/submit",
        data: {'data': result},
        success: function(response){
            display(response);
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function check() {
    if (val > 0) {
        Swal.fire({
            title: 'You do not require medical attention',
            text: 'If you continue to feel ill, please Make an appointment with your primary care physician',
            type: 'success',
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {

    let num = qs.length;
    let div = document.getElementById("questions");

    for (i = 0; i < num; i++) {

        d = document.createElement("div");
        d.id = i;
        if (i > 0) {
            d.setAttribute("hidden", "true");
        }

        q_w = qs[i].split("_");
        q = document.createElement("p");
        q.innerHTML = q_w[0] + ": ";
        q.setAttribute("style", "margin-bottom: 0");

        q_y = document.createElement("input");
        q_y.type = "checkbox";
        q_y.id = "yes_"+String(i);

        q_n = document.createElement("input");
        q_n.type = "checkbox";
        q_n.id = "no_"+String(i);

        d.appendChild(q);
        d.appendChild(document.createElement("br"));
        d.appendChild(q_y);
        d.appendChild(q_n);
        div.appendChild(d);

        if (i == num - 1) {
            document.getElementById("yes_"+String(i)).addEventListener("click", function() {
                val++;
                let id = parseInt(this.id.split('_')[1]);
                let s = qs[id].split("_")[0];
                document.getElementById(String(id)).hidden = true;
                check();
            });
            document.getElementById("no_"+String(i)).addEventListener("click", function() {
                let id = parseInt(this.id.split('_')[1]);
                let s = qs[id].split("_")[0];
                document.getElementById(String(id)).hidden = true;
                check();
            });
        }

        else {

            if (q_w[1] == "0") {
                document.getElementById("yes_"+String(i)).addEventListener("click", function() {
                    val++;
                    let id = parseInt(this.id.split('_')[1]);
                    let s = qs[id].split("_")[0];
                    document.getElementById(String(id)).hidden = true;
                    document.getElementById(String(id+1)).hidden = false;
                });
            }
    
            else if (q_w[1] == "1") {
                document.getElementById("yes_"+String(i)).addEventListener("click", function() {
                    result[2] = 'H';
                    result[1] = ''
                    val++;
                    let id = parseInt(this.id.split('_')[1]);
                    let s = qs[id].split("_")[0];
                    document.getElementById(String(id)).hidden = true;
                    document.getElementById(String(id+1)).hidden = true;
                    Swal.fire({
                        title: 'Visit hospital',
                        text: 'Plan an appointment with your primary care physician',
                        type: 'info',
                    });
                    navigator.geolocation.getCurrentPosition(success);
                });
            }
    
            else if (q_w[1] == "2") {
                document.getElementById("yes_"+String(i)).addEventListener("click", function() {
                    result[2] = 'E';
                    result[1] = 'Acute Stroke';
                    val++;
                    let id = parseInt(this.id.split('_')[1]);
                    document.getElementById(String(id)).hidden = true;
                    document.getElementById(String(id+1)).hidden = true;
                    Swal.fire({
                        title: 'Emergency Room!',
                        text: 'Immediately go to the emergency room displayed below',
                        type: 'error',
                    });
                    navigator.geolocation.getCurrentPosition(success);
                });
            }
    
            else if (q_w[1] == "3") {
                document.getElementById("yes_"+String(i)).addEventListener("click", function() {
                    val++;
                    let id = parseInt(this.id.split('_')[1]);
                    document.getElementById(String(id)).hidden = true;
                    document.getElementById(String(id+1)).hidden = true;
                    Swal.fire({
                        title: 'Call 9-1-1!',
                        text: 'Immediately seek medical attention',
                        type: 'error',
                    });
                });
            }
    
            document.getElementById("no_"+String(i)).addEventListener("click", function() {
                let id = parseInt(this.id.split('_')[1]);
                document.getElementById(String(id)).hidden = true;
                document.getElementById(String(id+1)).hidden = false;
            });
        }
    }
}, false);