import React, { Component } from 'react';
import logo from './pill-transparent-pink.png';
import './App.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

import { pinkVidsRandom, blueVidsRandom, purpleVidsRandom } from './gifs';



class App extends Component {
  state = {
    orientation: "Horizontal",
    width: 800,
    height: 800,
    title: 'X-Change',
    title_size: '64',
    title_offset_x: '0',
    title_offset_y: '0',
    tag_size: '24',
    tag_offset_x: '0',
    tag_offset_y: '0',
    tag_rotate: '0',
    font_size: '24',
    caption: `I was trying to do some programming for work when I got a huge headache.  I went to the bathroom and took a pill that I thought was Aspirin.  Imagine my surprise when I transformed into a sexy, brunette.
    
    Well when when my roommate, Lucky, walked in I had to explain that I mistook his X-Change for Aspirin.`,
    tagline: 'The Fast-Acting, Temporary, Gender-Swapping Pill',
    gif_url: 'https://thumbs2.redgifs.com/InbornQuietMandrill.mp4',
    gif_height_adjust: '35',
    signoff: '-Dani, no more headache',
    accentColor: '#dd2bbc', // Pink: #dd2bbc, Purple: #800080, Blue: #1d61d1
    captionBoxColor: '#ffc0cb', // Pink: #ffc0cb, Purple: #ac62f4, Blue: #acdeff
    show_advanced: false,
    render_as_raw: false,
    fileProcessing: false,
    showModal: false,
    img_Name: '',
  }

  constructor() {
    super();
    try {
      const url = new URL(window.location.href);
      this.state = {
        ...this.state
      };

      const save_data = this.loadData(false)
      const {
        orientation,
        title,
        caption,
        title_size,
        title_offset_x,
        title_offset_y,
        tagline,
        tag_size,
        tag_offset_x,
        tag_offset_y,
        tag_rotate,
        font_size,
        gif_url,
        gif_height_adjust,
        signoff,
        render_as_raw,
        accentColor,
        captionBoxColor,
      } = save_data;
      this.state = {
        ...this.state,
        orientation,
        title,
        caption,
        title_size,
        title_offset_x,
        title_offset_y,
        tagline,
        tag_size,
        tag_offset_x,
        tag_offset_y,
        tag_rotate,
        font_size,
        gif_url,
        gif_height_adjust,
        signoff,
        render_as_raw,
        accentColor,
        captionBoxColor,
      };

      this.onProcessFinished = this.onProcessFinished.bind(this);
    } catch (e) { }
  }

  componentDidMount() {
    // need to defer loading to load font
    document.title = 'X-Change Caption Creator';
    //window.addEventListener('load', this.draw);
    const data = this.loadData(false);
    if (data == null) {
      this.slowType(` He generously offered to help relieve my headache...`);
      this.setState({showModal: true});
    }
    this.textArea.focus();
    setInterval(this.poll, 50);
  }

  poll = () => {
    this.forceUpdate();
  }

  slowType(text) {
    if (text.length === 0) {
      return;
    }
    setTimeout(
      () => {
        this.setState(
          prevState => ({caption: prevState.caption + text[0]}),
          () => {
            this.slowType(text.substr(1));
          },
        );
      },
      10,
    );
  }

  componentWillUnmount() {
    // need to defer loading to load font
    window.removeEventListener('load', this.draw);
  }

  componentDidUpdate() {
    this.draw();
  }

  getGifHeight() {
    let gif_height = 0;
    if (this.state.orientation === "Horizontal") {
      gif_height = ((this.gif && this.gif.offsetHeight) || 400)
        - (parseInt(this.state.gif_height_adjust || 0));
    } else {
      gif_height = ((this.gif && this.gif.offsetHeight) || 400);
    }
    if (gif_height % 2 === 0) {
      return gif_height + 1;
    }
    return gif_height;
  }

  getHeight() {
    if (!this.ctx) {
      return 1;
    }
    return this.getGifHeight() + 8 + (this.getCaptionLines().length) * 29 + 48;
  }

  getGifWidth() {
    const gif_width = (this.gif && this.gif.offsetWidth) || 400;
    return gif_width;
  }

  getWdith() {
    if (!this.ctx) {
      return 1;
    }
    return this.getGifWidth() + 8 + (this.getCaptionLines().length) * 29 + 48;
  }

  draw = () => {
    if(this.state.orientation === "Horizontal") {
      this.ctx.clearRect(0, 0, this.state.width, this.getHeight());
    } else {
      this.ctx.clearRect(0, 0, this.getGifWidth *2, this.getGifHeight())
    }
    this.drawTitle();
    this.drawTagline();
    this.drawCaptionBox();
    this.drawCaption();
    this.drawSignoff();
  }

  getCaptionLines() {
    const text = this.state.render_as_raw
      ? this.state.caption
      : ('    ' + this.state.caption.replace(/\n+\s*/g, '\n\n    ').trim());
    var i;
    var j;
    var width;
    var max_width = this.state.orientation === 'Horizontal' ? this.state.width - 30 : this.getGifWidth() - 15;
    var result;
    const textBlocks = text.split('\n');
    const lines = [];

    textBlocks.forEach(text => {
      var words = text.split(" ");
      var currentLine = words[0];
      for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = this.ctx.measureText(currentLine + " " + word).width;
        if (width < max_width) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    });
    lines.push('');
    return lines;
  }

  drawTitle() {
    const text = this.state.title;
    var x = 16 + parseInt(this.state.title_offset_x);
    var y = 13 + parseInt(this.state.title_offset_y);
    this.ctx.font = "bold " + this.state.title_size + "px Aardvark Cafe";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    // this.ctx.shadowColor = "black";
    // this.ctx.shadowOffsetX = 2;
    // this.ctx.shadowOffsetY = 2;
    // this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = 8;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(text, x, y);
    this.ctx.textBaseline = 'alphabetic';
  }

  drawTagline() {
    const text = this.state.tagline;
    if (this.state.tag_rotate !== '0') {
      this.ctx.save();
      if (this.state.tag_rotate === '90') {
        this.ctx.rotate(-Math.PI/2);
      } else {
        this.ctx.rotate(Math.PI/2);
      }
    }
    this.ctx.font = this.state.tag_size + "px Aardvark Cafe";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 4;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'white';

    let x = (this.state.orientation === 'Horizontal' ? this.state.width: this.state.width/2) + parseInt(this.state.tag_offset_x) - 8;
    const fontSize = 16;
    let y = (this.getGifHeight() - 20) + parseInt(this.state.tag_offset_y);
    if (this.state.tag_rotate !== '0') {
      if (this.state.tag_rotate === "90") {
        x = parseInt(this.state.tag_offset_y) - 20
        y =  (this.state.orientation === 'Horizontal' ? this.state.width : this.state.width/2) + parseInt(this.state.tag_offset_x) - 8;
      } else {
        x = 450 + parseInt(this.state.tag_offset_y);
        y = parseInt(this.state.tag_offset_x)-20;
      }
    }
    const num_lines = this.getCaptionLines().length;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.strokeText( text, x, y );
    this.ctx.fillText( text, x, y );
    if (this.state.tag_rotate !== '0') {
      this.ctx.restore();
    }
  }

  drawCaptionBox() {
    if (this.state.orientation === 'Horizontal') {
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = this.state.captionBoxColor;
      this.ctx.fillRect(0, this.getGifHeight(), 2000, 2000);
    } else {
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = this.state.captionBoxColor;
      this.ctx.fillRect(this.getGifWidth(), 0, 2000, this.getGifHeight());
    }
  }

  drawCaption() {
    this.ctx.font = `bold ${this.state.font_size}px Tahoma`;
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = parseInt(this.state.font_size)/6;
    this.ctx.fillStyle = 'white';

    const lines = this.getCaptionLines();
    const y = this.getGifHeight();
    const x = this.getGifWidth();
    const fontSize = parseInt(this.state.font_size);
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    if (this.state.orientation === 'Horizontal') {
      for (let i=0, j=lines.length; i<j; ++i ) {
        this.ctx.strokeText( lines[i],  parseInt(this.state.font_size)-8, y + fontSize + (fontSize+5) * i + 12);
        this.ctx.fillText( lines[i],  parseInt(this.state.font_size)-8, y + fontSize + (fontSize+5) * i + 12);
      }
    } else {
      for (let i=0, j=lines.length; i<j; ++i ) {
        this.ctx.strokeText( lines[i], x + parseInt(this.state.font_size)-8, fontSize + (fontSize+5) * i + 12);
        this.ctx.fillText( lines[i], x + parseInt(this.state.font_size)-8, fontSize + (fontSize+5) * i + 12);
      }
    }
  }

  drawSignoff() {
    const text = this.state.signoff;
    this.ctx.font = `bold ${this.state.font_size}px Tahoma`;
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = parseInt(this.state.font_size)/6;
    this.ctx.fillStyle = 'white';

    if (this.state.orientation === 'Horizontal') {
      const x = this.state.width - 16;
      const fontSize = 24;
      const y = this.getGifHeight() + 12;
      const num_lines = this.getCaptionLines().length;
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'right';
      this.ctx.strokeText( text, x, y + fontSize + (fontSize+5) * num_lines );
      this.ctx.fillText( text, x, y + fontSize + (fontSize+5) * num_lines );
    } else {
      const x = this.state.width -5;
      const fontSize = 24;
      const y = this.getGifHeight() - parseInt(this.state.gif_height_adjust);
      const num_lines = this.getCaptionLines().length;
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'right';
      this.ctx.strokeText( text, x, y );
      this.ctx.fillText( text, x, y);
    }
  }

  switchVariant(color) {
    switch(color){
      case "pink":
        this.setState({
          accentColor: '#dd2bbc',
          captionBoxColor: '#ffc0cb',
        });
        break;
      case "blue":
        this.setState({
          accentColor: '#1d61d1',
          captionBoxColor: '#acdeff',
        });
        break;
      case "purple":
        this.setState({
          accentColor: '#800080',
          captionBoxColor: '#ac62f4',
        });
        break;
    }
  }

  showRandomGif() {
    switch(this.state.accentColor){
      case "#dd2bbc":
        this.setState({
          gif_url: pinkVidsRandom[Math.floor(Math.random()*pinkVidsRandom.length)]
        });
        break;
      case "#1d61d1":
        this.setState({
          gif_url: blueVidsRandom[Math.floor(Math.random()*blueVidsRandom.length)]
        });
        break;
      case "#800080":
        this.setState({
          gif_url: purpleVidsRandom[Math.floor(Math.random()*purpleVidsRandom.length)]
        });
        break;
      default:
        this.setState({
          gif_url: pinkVidsRandom[Math.floor(Math.random()*pinkVidsRandom.length)]
        });
        break;
    }
  }

  _renderContent() {
    if (
      this.state.gif_url.substr(-5) === '.webm'
      || this.state.gif_url.substr(-4) === '.mp4'
    ) {
      return (
        <video
        key={this.state.gif_url}
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          width={this.state.orientation === "Horizontal" ? 800 : 400}
          playsInline
          autoPlay
          muted
          loop
        >
          <source src={this.state.gif_url} type="video/mp4" />
        </video>
      )
    } else if (
      this.state.gif_url.substr(-4) === '.gif'
      || this.state.gif_url.substr(-4) === '.png'
      || this.state.gif_url.substr(-4) === '.jpg'
    ) {
      return (
        <img
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          width={this.state.orientation === "Horizontal" ? 800 : 400}
          src={this.state.gif_url}
        />
      )
    } else {
      return (
        <div
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          style={{display: 'table', height: '400px'}}
        >
          <div
            style={{display: 'table-cell', verticalAlign: 'middle'}}
          >
            I'm so sorry, I can't render that filetype.
          </div>
        </div>
      )
    }
  }

  _renderPreview() {
    if (this.state.orientation === "Horizontal") {
      return (
        <div className="preview">
          {this._renderContent(this.state.gif_url)}
          <canvas
            ref={ref => {
              if (ref) {
                this.canvas = ref;
                this.ctx = ref.getContext('2d');
              }
            }}
            width={this.state.width}
            height={this.getHeight() % 2 ? this.getHeight()+1 : this.getHeight()}
          />
        </div>
      );
    } else {
      return (
        <div className="previewVertical">
          {this._renderContent(this.state.gif_url)}
          <canvas
            ref={ref => {
              if (ref) {
                this.canvas = ref;
                this.ctx = ref.getContext('2d');
              }
            }}
            width={this.state.width}
            height={this.getHeight() % 2 ? this.getHeight()+1 : this.getHeight()}
          />
        </div>
      )
    }

  }

  saveData () {
  window.localStorage.setItem('caption-data', JSON.stringify(this.state));
  
  console.log(JSON.parse(window.localStorage.getItem('caption-data')));
  }

  loadData(setState) {
    const data = JSON.parse(window.localStorage.getItem('caption-data'));
    if (data) {
      if (setState) {
        this.setState(data);
      } else {
        return data;
      }
    }
  }

  deleteData () {
    window.localStorage.removeItem('caption-data');
    }

  async createDirs () {
    const fs = window.require('fs');
    let dir = '.\\ouput\\overlays\\';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    dir = '.\\ouput\\captions\\';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
  }

  async runCommand () {
    this.setState({
      fileProcessing: true
    });

    let filename = this.state.signoff
      .split(',')[0]
      .replace(/[^a-zA-Z0-9_ ]/g, '')
      .substr(0, 15);

    const blob = await new Promise(
      (resolve) => this.canvas.toBlob(blob => resolve(blob), "image/png")
    );
    const { Buffer } = window.require('buffer');
    const buffer = Buffer.from(await blob.arrayBuffer());
    const fs = window.require('fs');

    await fs.writeFile( `..\\${filename}.png`, buffer, "binary",
    function(err) {
      if (err) {
        throw err;
      }
    });

    const imgName = `..\\${filename}`;
    const homeDir = window.require('os').homedir(); 
    const downloadsFolder = `${homeDir}/Downloads`;
    let vidName = `${downloadsFolder}\\${filename}`;

    const pieces = this.state.gif_url.split('.');
    const extension = pieces[pieces.length-1];

    if (fs.existsSync(`${vidName}.${extension}`)) {
      let fileExists = 1;
      while (fileExists > 0) {
        vidName = `${downloadsFolder}\\${filename}(${fileExists})`;
        if (fs.existsSync(`${vidName}.${extension}`)) {
          fileExists += 1;
        } else {
          fileExists = 0;
        }
      };
    }

    const filterConfig = this.state.orientation === 'Horizontal' ? 
    `[1]scale=800:-1[a]; [0][a]overlay[b]; [b][0]overlay` :
    `[1]scale=${this.getGifWidth()}:-1[a]; [0][a]overlay[b]; [b][0]overlay[c]; [c]crop=${this.getGifWidth()*2}:${this.getGifHeight()}:${this.getGifHeight()}:0`;



    const ffmpegParams = ["-i",
        `${imgName}.png`,
        "-i",
        `${this.state.gif_url}`,
        "-filter_complex",
        filterConfig,
        `${vidName}.${extension}`,
    ];

    const { execFile } = window.require('child_process');
    const executablePath = ".\\public\\ffmpeg\\bin\\ffmpeg";
    console.log(ffmpegParams)
    this.setState({
      img_Name: `${imgName}.png`
    });

    const child = await execFile(executablePath, ffmpegParams);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    
    child.stderr.on('data', function (data) {
      console.log(data.toString());
    });
    await new Promise( (resolve) => {
        child.on('close', resolve)
    })
    this.onProcessFinished(child.exitCode, child.signalCode);
  }

  onProcessFinished(code, signal) {
    const fs = window.require('fs');
    fs.unlink(this.state.img_Name, function (err) {
      if (err) throw err;
      console.log(`caption overlay was deleted`);
    });
    this.setState({
      fileProcessing: false,
      img_Name: '',
    });
    if (code !== 0) {
      toast.error("Error Creating Caption");
    } else {
      toast.success(`Caption Created!`);
    }
    //await this.createDirs()

    
  }

  render() {
    const {
      orientation,
      title,
      title_size,
      title_offset_x,
      title_offset_y,
      caption,
      tagline,
      tag_size,
      tag_offset_x,
      tag_offset_y,
      tag_rotate,
      font_size,
      gif_url,
      gif_height_adjust,
      signoff,
      accentColor,
      captionBoxColor,
    } = this.state;
    const save_data = {
      orientation,
      title,
      title_size,
      title_offset_x,
      title_offset_y,
      caption,
      tagline,
      tag_size,
      tag_offset_x,
      tag_offset_y,
      tag_rotate,
      font_size,
      gif_url,
      gif_height_adjust,
      signoff,
      accentColor,
      captionBoxColor,
    };

    const save_link = JSON.stringify(save_data).toString("base64");

    return (
      <div className="main">
        <Modal
        isOpen={this.state.showModal} 
        contentLabel="Minimal Modal Example" 
        className="Modal"
        overlayClassName="Overlay">
          <h2>X-Change Caption Creator!</h2>
          <p style={{textAlign: 'center'}}>Welcome to the X-Change Caption Creator!  Your all in one X-Change style caption creaion application!
          <br></br><br></br>
          This application was based off HahaLuckyMe's X-Change Caption tool, but has been turned into an all in one application that incorporates ffmpeg to make creating captions simple and easy!
          <br></br><br></br>
          Simply paste the video/image URL into the URL / filepath field, or browse to the location of a downloaded video/image file to get started.
          <br></br><br></br>
          Change the Pill type, font sizes, tagline, title and tag locations, etc. from the Advanded section.  You can toggle Top/Bottom and Side-by-Side caption orientations by clicking the orientation toggle. (Note: Vertical or Side-by-Side captions may require adjusting the font sizes to get the text to fit.)
          <br></br><br></br>
          Click the pill presets buttons to change between Pink, Blue, and Purple X-Change variant presets.
          <br></br><br></br>
          You can save and come back to your caption settings, by clicking save.
          <br></br><br></br>
          When you've completed your caption, click "Create Caption" and ffmpeg will export your caption to a video or image file.  Captions are saved in your Downloads folder.
          <br></br><br></br>
          I hope you find this tool helpful and I can't wait to read all your fun captions!  
          <br></br><br></br>
          -Dan2dani

          
          </p>
          <button className="button" style={{right: "-40%"}}onClick={() => this.setState({showModal: false})}>Got it!</button>
        </Modal>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        {this.state.fileProcessing &&
          <div className="spinner">
            <h1>Creating Caption . . .</h1>
            <div className="loading"/>
          </div>
        }
        <div className="content">
          <div className="topbar">
            <div className="logobox">
              <img src={logo} className="logo" alt="logo" />
            </div>
            <div className="title">
              X-Change Caption Creator
            </div>
          </div>
          <button className="button" onClick={() => this.showRandomGif()}>Random Gif</button>
          <div className="input">
              <span title="The video or image filepath" style={{width: "max-content"}}>
                media URL / filepath
              </span>
              <input
                id="filePath"
                onChange={event => this.setState({gif_url: event.target.value})}
                value={this.state.gif_url}
                style={{
                  width: '400px',
                }}
                title="The URL or filepath of the video or image to caption"
              />
            <input type="file" id="selectedFile" style={{display: 'none'}} accept=".mp4, .webm, .png, .jpg, .gif"onChange={event => {
              this.setState({
                gif_url: document.getElementById("selectedFile").files[0].path
              });
            }}/>
            <input className="button" 
            type="button" 
            style={{width: "150px"}} 
            value="Browse..." 
            title="Find the file location of a video or image"
            onClick={() => document.getElementById('selectedFile').click()} 
            />
          </div>
          {
            this.state.show_advanced ? (
              <>
                <div className="input">
                  <span title="Toggle indentation for paragraphs">
                    prettify?
                  </span>
                  <input
                    onChange={event => this.setState(prevState => ({render_as_raw: !prevState.render_as_raw}))}
                    name="isGoing"
                    type="checkbox"
                    checked={!this.state.render_as_raw}
                    style={{
                      width: '100px',
                    }}
                  />
                </div>
                <div className="input">
                  <span>
                    height adjust
                  </span>
                  <input
                    onChange={event => this.setState({gif_height_adjust: event.target.value})}
                    value={this.state.gif_height_adjust}
                    style={{
                      width: '100px',
                    }}
                  />
                </div>
                <div className="input">
                  <span title="Text for the pill type for the this caption">
                    pill
                  </span>
                  <input
                    onChange={event => this.setState({title: event.target.value})}
                    value={this.state.title}
                  />
                </div>
                < div className="title-options">
                  <div className="input">
                    <span title="Font size for the pill text">
                      pill size
                    </span>
                    <input
                      onChange={event => this.setState({title_size: event.target.value})}
                      value={this.state.title_size}
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                    />
                  </div>
                  pill offset
                  <div className="input">
                    <span title="Pill Horizontal Offset" style={{marginLeft: '10px'}}>
                       x:
                    </span>
                    <input
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({title_offset_x: event.target.value})}
                      value={this.state.title_offset_x}
                    />
                  </div>
                  <div className="input">
                    <span title="Pill Vertical Offset">
                      y:
                    </span>
                    <input
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({title_offset_y: event.target.value})}
                      value={this.state.title_offset_y}
                    />
                  </div>
                </div>
                <div className="input">
                  <span title="The little slogan at the bottom of the caption">
                    tagline
                  </span>
                  <input
                    onChange={event => this.setState({tagline: event.target.value})}
                    value={this.state.tagline}
                  />
                </div>
                <div className="tag-options">
                  <div className="input">
                    <span title="Font size of the tagline">
                      tagline size
                    </span>
                    <input
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({tag_size: event.target.value})}
                      value={this.state.tag_size}
                    />
                  </div>
                  tagline offset
                  <div className="input">
                    <span title="Tagline Horizontal Offset" style={{marginLeft: '10px'}}>
                       x:
                    </span>
                    <input
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({tag_offset_x: event.target.value})}
                      value={this.state.tag_offset_x}
                    />
                  </div>
                  <div className="input">
                    <span title="Tagline Vertical Offset">
                      y:
                    </span>
                    <input
                      style={{width: '50px', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({tag_offset_y: event.target.value})}
                      value={this.state.tag_offset_y}
                    />
                  </div>
                  <div className="input">
                    <span title="Font size of the tagline">
                      tagline rotate
                    </span>
                    <select
                      style={{width: 'auto', marginLeft:'10px',  marginRight:'10px'}}
                      onChange={event => this.setState({tag_rotate: event.target.value})}
                      value={this.state.tag_rotate}
                    >
                      <option value="0">0</option>
                      <option value="90">90</option>
                      <option value="-90">-90</option>
                    </select>
                  </div>
                </div>
                <div className="input">
                  <span title="Font size for the caption">
                    caption font size
                  </span>
                  <input
                    onChange={event => this.setState({font_size: event.target.value})}
                    value={this.state.font_size}
                  />
                </div>
                <div className="input">
                  <span title="Stroke color of the text">
                    accent color
                  </span>
                  <input
                    onChange={event => this.setState({accentColor: event.target.value})}
                    value={this.state.accentColor}
                    >
                  </input>
                </div>
                <div className="input">
                  <span title="Background color of the caption text">
                    caption box color
                  </span>
                  <input
                    onChange={event => this.setState({captionBoxColor: event.target.value})}
                    value={this.state.captionBoxColor}
                    >
                  </input>
                </div>
                <button
                className="button"
                  title="Advanced options"
                    onClick={() => this.setState({show_advanced: false})}
                  >
                  Hide Advanced
                </button>
              </>
            ) : (
              <button
              className="button"
              title="Advanced options"
                onClick={() => this.setState({show_advanced: true})}
              >
                Advanced
              </button>
            )
          }
          <textarea
            ref={ref => {
              if (ref) {
                this.textArea = ref;
              }
            }}
            onChange={event => this.setState({caption: event.target.value})}
            value={this.state.caption}
          />
          <div className="input">
            <span title={`Toggle the caption orientation. \nTop/Bottom=Horizontal \nSide-by-side=Vertical`}>orientation</span>
            <button className="button"
            style={{marginRight: '40px', marginTop: '10px', marginLeft: '10px'}}
             onClick={() => this.setState({
              orientation: this.state.orientation === "Horizontal" ? "Vertical" : "Horizontal"
            })}>{this.state.orientation}</button>
            <span title="The pill taker's sign off">
              signoff
            </span>
            <input
              onChange={event => this.setState({signoff: event.target.value})}
              value={this.state.signoff}
            />
          </div>
          <div className="selectorTitle">Pill Presets</div>
          <div className="selectorbar">
            <button className="selectorbutton pink" onClick={() => this.switchVariant("pink")} title="Change to Pink Pill Caption Color Presets"></button>
            <button className="selectorbutton blue" onClick={() => this.switchVariant("blue")} title="Change to Blue Pill Caption Color Presets"></button>
            <button className="selectorbutton purple" onClick={() => this.switchVariant("purple")} title="Change to Purple Pill Caption Color Presets"></button>
          </div>
          <div className="previewbar">
            <button className="button" onClick={() => this.setState({showModal: true})}>Instructions</button>
            <button className="button" onClick={() => this.saveData()}>Save</button>
            <button className="button" onClick={() => this.loadData(true)}>Load</button>
            <button className="button" onClick={() => this.deleteData()}>Delete</button>
            <a id="link"></a>
            <button 
            className="button"
            onClick={() => this.runCommand()}>
              <b>Create Caption</b>
            </button>
          </div>
          {this._renderPreview()}
        </div>
      </div>
    );
  }
}

export default App;
