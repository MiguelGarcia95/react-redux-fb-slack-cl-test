import React from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';

class Channels extends React.Component {
  state = {
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: ''
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

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
            <Form>
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
            <Button color='green' inverted>
              <Icon name='checkmark '/> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove '/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default Channels;