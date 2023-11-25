import { MenuItem, TextField, styled } from '@mui/material';
import * as discord from '../content-source/discord-api.ts';
import '../stylings/content/backgroundchanger.css';
import * as sideMenu from '../utils/SideMenu.ts';

export default function BackgroundChanger() {  

  sideMenu.toggle(document.getElementById('sidemenu-background-change')!);
  discord.setChilling(`Background changer`);

  function search(event: any) {
    // if (event.keyCode === 13) {
    //   alert('You pressed enter!');
    // }
  }
  
  //styling 
  const InputTextField = styled(TextField)({
    input: {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  });

  function getOptions(){
    let options = {
      "mode": [
        "Wallpaper cave",
      ]
    };
    return options;
  }

  const mode = getOptions().mode;

  // Use the styled function to create a custom styled MenuItem component
  const StyledMenuItem = styled(MenuItem)(() => ({
    backgroundColor: '#0F0000',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '0px',
    '&:hover': {
      backgroundColor: '#311A1E',
      color: 'white',
    },
    '&.Mui-selected': {
      backgroundColor: '#3F0D12',
      color: 'red',
      '&:hover': {
        backgroundColor: '#6F1016',
      },
    },
  }));

  return (
      <div className='background-changer'>
        <div className='background-changer-searchItems'>
        <InputTextField
            className='bg-search-generic-input'
            id="background-changer-query"
            label="Search"
            name="email"
            onKeyDown={search}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          />
        <InputTextField
          className='bg-search-generic-input'
          id="background-changer-source"
          select
          label="Mode"
          defaultValue={search}
          InputProps={{
            style: { color: 'white' },
          }}
          InputLabelProps={{
            style: { color: 'gray' },
          }}
        >
          {mode.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
        </InputTextField>
        </div>
      </div>
  );
}

/*
 <InputTextField
              className='double-width '
              id="media2-input"
              label="Search"
              name="email"
              onKeyDown={search}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'gray' },
              }}
            />
          <InputTextField
            className='double-width2'
            id="media2-mode"
            select
            label="Mode"
            defaultValue={defMode}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
*/