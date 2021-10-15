(function() {
    let FCBakeAction;
    Plugin.register('fcurves_bake', {
        title: 'Sound F-Curvers Baker',
        icon: 'graphic_eq',
        author: 'Malik12tree',
        description: 'Bake sounds f-curves into simple animation keyframes.',
        version: '1.0',
        variant: "both",
        onload() {
            FCBakeAction = new Action("bake_curves", {
                name: "Bake Sound F-Curves",
                // description: "bake f-curves...",
                icon: "graphic_eq",
                click: function(){
                    if (!Group.selected) {
                        Blockbench.showQuickMessage( "No bones selected" )
                        return;
                    }
                    let fcDial = new Dialog({
                        title: "Sound F-Curves Bake Settings",
                        lines: [
                            `<p><input type="file" id="FCimport" accept=".ogg,.wav,.mp3"></p>
                            
                            <p>
                            <label>Channel: 
                            <select id="FCchannel" style="width: 66.5%;padding-top: 3px;padding-left: 10px;position:relative;left:20.5%;">
                            <option value="Rotation">Rotation</option>
                            <option value="Position">Position</option>
                            <option value="Scale">Scale</option>
                            </select>
                            </label></p>
                            
                            <p>Axis:
                            <label style="padding-left: 20%;position:relative; left:45px;">X: <input id="FCx" type="checkbox" checked="true"></label>
                            <label style="padding-left: 20%;position:relative; left:45px;">Y: <input id="FCy" type="checkbox" checked="true"></label>
                            <label style="padding-left: 20%;position:relative; left:45px;">Z: <input id="FCz" type="checkbox" checked="true"></label>                            
                            </p>
                            `
                        ],
                        id:'sound_fcurves_bake_settings',
                        form: {
                            offset: {label: "Offset",type:"number", min:0, max: Infinity, value: (Timeline.time).toFixed(2) * 1},
                            multiplier: {label: "Power Multiplier",type:"number", min:1, max:Infinity, value:1, step: .25},
                            invert: {label:"Invert", type: "checkbox"}
                        },
                        onConfirm: function(out){
                            FCdialconfirm(out, {
                                channel: $("select#FCchannel")[0].value,
                                axes: [$("input#FCx")[0].checked, $("input#FCy")[0].checked, $("input#FCz")[0].checked]
                        });
                        }
                    });
                    fcDial.show();
                }
            })
            MenuBar.addAction(FCBakeAction, "animation");
        },
        onunload() {
            FCBakeAction.delete();
        }
    });
})()
//Timeline.animators.find(e => e.sound).keyframes[0]
function writeFCKeyframes(data, fdata, dur, Linesdata) {
    let invert = 1;
    if (data.invert === true) {
        invert = -1;
    } else{
        invert = 1;
    }
    let axesF = ['x', 'y', 'z'];
    if (Group.selected) {
        let time = data.offset;
        let channel = Linesdata.channel.toLowerCase();
        let keyframes = [];
        // let use_keyframes = [];


        // Timeline.keyframes.forEach(keyF => {
        //     if (keyF.channel === channel && keyF.animator.name == Group.selected.name) {
        //         //get wanted key frames
        //         use_keyframes.push(keyF);
        //     }
        // });
        let dps = [{}];
        // use_keyframes.sort((a, b) => a.time - b.time);                        
            Undo.initEdit({keyframes});
            let kfT;
            // console.log(kfT);
            for (let i = 0; i < fdata.length; i++) {
                let k = 0;
                if (Timeline.animators.find(e => e.name == Group.selected.name).keyframes.length > 0) {
                    // kfT = Timeline.keyframes.find(kf => kf.uuid == use_keyframes.last().uuid);
                    kfT = Timeline.animators.find(e => e.name == Group.selected.name).keyframes.last()
                }
                axesF.forEach(axis => {
                    if (Linesdata.axes[k] === true) {
                        eval(`dps[0].${axis}= ${(((fdata[i] / 10)*data.multiplier)*invert)}`);
                    } else{
                        if (Timeline.animators.find(e => e.name == Group.selected.name).keyframes.length > 0) {
                            eval(`dps[0].${axis}= kfT.data_points[0].${axis} * 1`);
                        }
                    }
                    k++
                });
                let kf = new Keyframe({
                    channel, time,
                    data_points: dps     
                });
                // Timeline.keyframes.find(kf => kf.uuid == use_keyframes[0].uuid).animator[channel].push(kf);
                Timeline.animators.find(e => e.name == Group.selected.name)[channel].push(kf);
                keyframes.push(kf);
                // kf.animator = Timeline.keyframes.find(kf => kf.uuid == use_keyframes[0].uuid).animator;
                kf.animator = Timeline.animators.find(e => e.name == Group.selected.name);
                time+= .0175 / 1.25 //((dur / 100) / dur) * 2
                //.25
            }
            Undo.finishEdit('baked f-curves into keyframes');
            
    }
}
function FCdialconfirm(data, Linesdata) {
    let importFC = $("input#FCimport")[0];
    if (importFC.value) {
        const reader = new FileReader();
        reader.onload = function () {
            startBake(reader.result, data, Linesdata);
        }
        reader.readAsDataURL(importFC.files[0])
        // console.log(importFC.files[0].path)
    } else{
        Blockbench.showQuickMessage( "No file provided" )
    }
}

function startBake(url,data, Linesdata) {
    let Bakecancled = false;
    var audioE = document.createElement('audio');
    audioE.src = url;
    let bakeProg = 0;
    let bakeProgstep = 0;
    let bufferLength;
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    let analyser = audioCtx.createAnalyser();
    let source;
    let ones = {
        p: 0
    };
    audioCtx.resume();
    if (ones.p === 0) {
        source = audioCtx.createMediaElementSource(audioE);
    }
    if (Blockbench.isNewerThan('3.9')) {
        Project.locked = true
    }
    ones.p++
    source.connect(analyser);
    // analyser.connect(audioCtx.destination);    
    analyser.fftSize = 2048;  
    bufferLength = analyser.frequencyBinCount;
    audioE.play();
    let fdata = [];
    audioE.addEventListener('loadedmetadata', function(){
        bakeProgstep = .0170 / audioE.duration;
        if (Blockbench.isNewerThan('3.9')) {
            Blockbench.showQuickMessage( "Project is currently locked.", audioE.duration * 1000)   
        }
        bake(analyser,audioE,bufferLength,fdata, bakeProg,bakeProgstep, Bakecancled, data, audioE.duration, Linesdata);
    },false);
}
function bake(analyser ,audioE ,bufferLength ,fdata ,bakeProg ,bakeProgstep ,Bakecancled,data,duration, Linesdata) {
        let dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        let dataAvg = 0;
        for (let i = 0; i < dataArray.length; i++) {
            dataAvg+= dataArray[i]; 
        }
        
        dataAvg = (dataAvg / dataArray.length).toFixed(4) * 1;
        fdata.push(dataAvg);
        bakeProg+= bakeProgstep;
        
            
        if (!audioE.paused && !Bakecancled) {
            Blockbench.showStatusMessage( "Baking Sound's F-Curves", 10 );
            Blockbench.setProgress( bakeProg );
            requestAnimationFrame(function() {
                bake(analyser,audioE,bufferLength,fdata ,bakeProg ,bakeProgstep ,Bakecancled,data,duration, Linesdata);
            });
        } else if(!Bakecancled){
            //end
            if (Blockbench.isNewerThan('3.9')) {
                Project.locked = false
            }
            audioE.pause();
            // console.log(fdata);
            Blockbench.setProgress( 0 );
            // writeFCKeyframes(data, fdata)
            writeFCKeyframes(data, fdata, duration, Linesdata)
            
        } else if(Bakecancled){
            if (Blockbench.isNewerThan('3.9')) {
                Project.locked = false
            }
            audioE.pause();
            Blockbench.setProgress( 0 );
        }
}