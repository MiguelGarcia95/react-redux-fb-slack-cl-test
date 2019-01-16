import React from 'react';
import uuidv4 from 'uuid/v4';
import {Segment, Button, Input} from 'semantic-ui-react';
import {Picker, emojiIndex} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
  state = {
    message: '',
    uploadState: '',
    uploadTask: null,
    loading: false,
    percentUploaded: 0,
    channel: this.props.currentChannel,
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    user: this.props.currentUser,
    errors: [],
    modal: false,
    emojiPicker: false
  }

  openModal = () => this.setState({modal: true})
  closeModal = () => this.setState({modal: false})

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleKeyDown = () => {
    const {message, typingRef, channel, user} = this.state;

    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove()
    }
  }

  handleTogglePicker = () => {
    this.setState({emojiPicker: !this.state.emojiPicker})
  }

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };

    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
    }

    return message;
  }

  sendMessage = () => {
    const {getMessagesRef} = this.props;
    const {message, channel, typingRef, user} = this.state;

    if (message) {
      this.setState({loading: true})
      getMessagesRef().child(channel.id).push().set(this.createMessage()).then(() => {
        this.setState({loading: false, message: '', errors: [] })
        typingRef
          .child(channel.id)
          .child(user.uid)
          .remove()
      }).catch(err => {
        console.error(err);
        this.setState({
          loading: false,
          errors: this.state.errors.concat({message: err.message})
        });
      })
    } else {
      this.setState({
        errors: this.state.errors.concat({message: 'Add a message'})
      });
    }
  }

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return `chat/public`;

    }
  }

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
    

    this.setState({
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          this.setState({percentUploaded: percentUploaded});
          this.props.isProgressBarVisible(percentUploaded);
        }, err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            uploadState: 'error',
            uploadTask: null
          })
        },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
              this.sendFileMessage(downloadUrl, ref, pathToUpload);
            }).catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
              })
            })
          }
        )
      }
    )
  }

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
      this.setState({uploadState: 'done'});
    }).catch(err => {
      console.error(err);
      this.setState({
        errors: this.state.errors.concat(err)
      })
    })
  }

  render () {
    const {errors, message, loading, modal, uploadState, percentUploaded, getMessagesRef} = this.state;
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          style={{marginBottom: '0.7em'}}
          label={<Button icon={'add'} onClick={this.handleTogglePicker} />}
          labelPosition='left'
          value={message}
          className={
            errors.some(error => error.message.includes('message')) ? 'error' : ''
          }
          placeholder='Write your message'
        />
        <Button.Group icon widths='2'>
          <Button
            onClick={this.sendMessage}
            color='orange'
            content='Add Reply'
            labelPosition='left'
            disabled={loading}
            icon='edit'
          />
          <Button
            color='teal'
            onClick={this.openModal}
            disabled={uploadState === 'uploading'}
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar 
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    )
  }
}

export default MessageForm;
