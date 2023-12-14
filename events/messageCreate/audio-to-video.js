const ffmpeg = require('fluent-ffmpeg');

module.exports = async(m, instance) => {
  if(m.guildId !== '1151845690650140702') return;
  
  if(m.attachments.size === 0) return;
  
  const contentType = [
    'audio/mpeg', 
    'audio/flac', 
    'audio/x-wav'
    ]
  
  if(!contentType.includes(m.attachments.first().contentType)) return;
  
  const txt = await m.channel.send({
    content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ rendering 。。。${m.url}`
  })
  
  ffmpeg()
  //.input('./reference.png')
  //.input('/storage/emulated/0/Download/7ed4d44a8db7eff8c602688db1998b4d.png')
  .input('/storage/emulated/0/Download/frame_09_delay-0.05s.jpg')
  .loop()
  .addInputOption('-framerate 2')
  .input(m.attachments.first().url)
  .videoCodec('libx264')
  .videoFilters({
    filter: 'drawtext',
    options: {
      fontfile: '/system/fonts/NotoSerif-Regular.ttf',
      text: `${m.attachments.first().name}`,
      fontsize: 22,
      fontcolor: 'white',
      boxcolor: 'black',
      x: '(main_w/2-text_w/2)',
      y: 50,
      box: 1
    }
  })
  .audioCodec('libopus')
  .audioBitrate('320k')
  .videoBitrate('12k', true)
  .size('1920x1080')
  .autopad()
  .outputOptions([
    '-preset medium',
    '-tune stillimage',
    '-crf 18',
    '-pix_fmt yuv420p',
    '-shortest'
  ])
  /*
  .on('progress', (progress) => {
    if (progress.percent) {
      console.log(`Rendering: ${progress.percent}% done`)
    }
    
  })
  */
  .on('codecData', (data) => {
    console.log('codecData=', data);
  })
  .on('end', async () => {
    console.log('Video has been converted succesfully');
       
    return txt.edit({
      content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ rendered output! ${m.url}`,
      files: [
        './output.mp4'
      ]
    }).catch(() => {
      return txt.edit({
        content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ output too large! ${m.url}`
      })
    })
  })
  .on('error', function (err) {
    console.log('errer rendering video: ' + err.message);
        
    return txt.edit({
      content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ rendering failed! ${m.url}`
    })
  })
  .output('./output.mp4')
  .run()
}