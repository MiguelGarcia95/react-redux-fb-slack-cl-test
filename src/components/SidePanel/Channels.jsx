import React from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';
import firebase from '../../firebase';

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels')
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = e => {
    e.preventDefault();
    if(this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  addChannel = () => {
    const {channelsRef, channelName, channelDetails, user} = this.state;
    //get unique key
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef.child(key).update(newChannel).then(() => {
      this.setState({channelName: '', channelDetails: ''});
      this.closeModal();
      console.log('channel added');
    }).catch(err => {
      console.error(err)
    })
  }

  isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

  closeModal = () => this.setState({modal: false});

  openModal = () => this.setState({modal: true});

  render () {
    const {channels, modal} = this.state;


    return (
      <React.Fragment>
        <Menu.Menu style={{paddingBottom: '2em'}}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span> {" "}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </Menu.Item>
          {/* Channels */}
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add A Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label='Channel Details'
                  name='channelDetails'
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark'/> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove'/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default Channels;
