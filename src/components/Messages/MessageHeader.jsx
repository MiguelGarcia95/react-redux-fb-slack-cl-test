import React from 'react';
import {Header, Segment, Input, Icon} from 'semantic-ui-react';

class MessageHeader extends React.Component {
  render () {
    const {channelName, users, handleSearchChange, searchLoading, isPrivateChannel, handleStar, isChannelStarred} = this.props;
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid='true' as='h2' floated='left' style={{marginBottom: 0}}>
          <span>
            {channelName}
            {!isPrivateChannel && (
              <Icon 
                onClick={handleStar} 
                name={isChannelStarred ? 'star' : 'star outline'} 
                color={isChannelStarred ? 'yellow' : 'black'} 
              />
            )}
          </span>
          <Header.Subheader>{users}</Header.Subheader>
        </Header>

        {/* Channel Search input */}
        <Header floated='right'>
          <Input
            size='mini'
            icon='search'
            name='searchTerm'
            onChange={handleSearchChange}
            placeholder='Search Messages'
            loading={searchLoading}
          />
        </Header>
      </Segment>
    )
  }
}

export default MessageHeader;
