import React, {Component} from 'react';
import './MediaViewer.scss';


export class MediaViewer extends Component {
  constructor(props) {
    super(props);
    this.mediaClicked = this.mediaClicked.bind(this);
    this.magnifiedMediaClicked = this.magnifiedMediaClicked.bind(this);
  }

  mediaClicked(index) {
    this.props.onMediaSelected(index);
  }

  magnifiedMediaClicked() {
    this.props.onMagnifiedMediaHidden();
  }

  render() {
    return (
      <div className="media-viewer">
        {this.props.mediaViewerData.mediaList.map((media, index) => (
          <Media
            key={index}
            index={index}
            selectedIndex={this.props.mediaViewerData.selectedMedia}
            media={media}
            mediaFolder={this.props.mediaFolder}
            onMediaClicked={this.mediaClicked} />
        ))}
        {this.props.mediaViewerData.selectedMedia !== -1 &&
          <MagnifiedMedia
            media={this.props.mediaViewerData.mediaList[this.props.mediaViewerData.selectedMedia]}
            mediaFolder={this.props.mediaFolder}
            onMediaClicked={this.magnifiedMediaClicked} />
        }
      </div>
    );
  }
}
  
class Media extends Component {
  constructor(props) {
    super(props);
    this.mediaClicked = this.mediaClicked.bind(this, this.props.index);
  }

  mediaClicked(index) {
    this.props.onMediaClicked(index);
  }

  render() {
    let classNameSelected = (this.props.selectedIndex === this.props.index) ? "selected" : "";
    let mediaName = fullMediaName(this.props.mediaFolder, this.props.media.name);

    return (
      this.props.media.name.endsWith(".mp4")
        ? <video className={classNameSelected} onClick={this.mediaClicked} preload>
            <source src={mediaName} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2"/>
          </video>
        : <img
            className={classNameSelected}
            src={mediaName} 
            alt={this.props.media.caption}
            onClick={this.mediaClicked} />
    );
  }
}

class MagnifiedMedia extends Component {
  constructor(props) {
    super(props);
    this.coverClicked = this.coverClicked.bind(this);
  }

  coverClicked(e) {
    e.preventDefault();
    this.props.onMediaClicked();
  }

  render() {
    let mediaName = fullMediaName(this.props.mediaFolder, this.props.media.name);

    return (
      <div className="magnified-media">
        <div className="cover" onClick={this.coverClicked}></div>
        {this.props.media.name.endsWith(".mp4")
          ? <video controls preload>
              <source src={mediaName} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2"/>
            </video>
          : <img src={mediaName} alt={this.props.media.caption} />
        }
      </div>
    );
  }    
}

const fullMediaName = (mediaFolder, mediaName) => (mediaFolder + "/" + mediaName);

export const createMediaViewerData = (mediaList, selectedMedia = -1) => ({mediaList: mediaList, selectedMedia: selectedMedia});

export const selectMedia = (mediaViewerData, mediaIndex) => Object.assign(mediaViewerData, {selectedMedia: mediaIndex});

export const unselectCurrentMedia = (mediaViewerData) => Object.assign(mediaViewerData, {selectedMedia: -1});
