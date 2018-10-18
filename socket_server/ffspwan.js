const { spawn } = require('child_process');

let ffspawn = (colorLevels, id)=>{
    return new Promise ((resolve, reject)=>{
        let rimin = String(colorLevels.red.in.min/1000);
        let gimin = String(colorLevels.green.in.min/1000);
        let bimin = String(colorLevels.blue.in.min/1000);
        let aimin = String(colorLevels.alpha.in.min/1000);
        let rimax = String(colorLevels.red.in.max/1000);
        let gimax = String(colorLevels.green.in.max/1000);
        let bimax = String(colorLevels.blue.in.max/1000);
        let aimax = String(colorLevels.alpha.in.max/1000);
        let romin = String(colorLevels.red.out.min/1000);
        let gomin = String(colorLevels.green.out.min/1000);
        let bomin = String(colorLevels.blue.out.min/1000);
        let aomin = String(colorLevels.alpha.out.min/1000);
        let romax = String(colorLevels.red.out.max/1000);
        let gomax = String(colorLevels.green.out.max/1000);
        let bomax = String(colorLevels.blue.out.max/1000);
        let aomax = String(colorLevels.alpha.out.max/1000);
        let bin = "./bin/ffmpeg";
        let argument = [];
        let input = "../img/src/"+id+".jpg";
        let output = "../img/render/"+id+".jpg";
        let filter = "colorlevels=rimin="+rimin+
                                ":gimin="+gimin+
                                ":bimin="+bimin+
                                ":aimin="+aimin+
                                ":rimax="+rimax+
                                ":gimax="+gimax+
                                ":bimax="+bimax+
                                ":aimax="+aimax+
                                ":romin="+romin+
                                ":gomin="+gomin+
                                ":bomin="+bomin+
                                ":aomin="+aomin+
                                ":romax="+romax+
                                ":gomax="+gomax+
                                ":bomax="+bomax+
                                ":aomax="+aomax;

        arguments.push("-i", input, "-vf", filter, "-y", output);
        const ffmpeg = spawn(bin, argument);

        ffmpeg.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ffmpeg.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        
        ffmpeg.on('close', (code) => {
            if (code === 0){
                resolve(code);
            }else{
                reject(code);
            }
            console.log(`child process exited with code ${code}`);
        });
    });
};