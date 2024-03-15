import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckIcon from '@mui/icons-material/Check';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EastIcon from '@mui/icons-material/East';
import './AiTrading.scss'
import {Container} from "@mui/material";
const AiTrading = () => {
  return (
      <>
        <Box className={'ai-trading'}>
            <Container>
                <Typography className={'title'}>Setting Ai Trading</Typography>

                <Box>
                    <Typography className={'title-create'}>Create My Bot</Typography>
                    <Box className={'card-newbot'}>
                        <div className={'card-title-box'}>
                            <SmartToyIcon/>
                            <Typography>Ai-trading</Typography>
                        </div>
                        <Typography className={'card-content'}>Auto-place buy/sell orders for better average price and close your position favorably.</Typography>
                        <div className={'card-advantage-box'}>
                            <div className={'feature'}>
                                <CheckIcon sx={{color: '#14C679FF'}}/>
                                <Typography>Create your plan</Typography>
                            </div>
                            <div className={'feature'}>
                                <CheckIcon sx={{color: '#14C679FF'}}/>
                                <Typography>Recurring investment</Typography>
                            </div>
                        </div>
                        <div className={'create-box'}>
                            <Typography>Create</Typography>
                            <EastIcon />
                        </div>
                    </Box>
                </Box>

                <Box className={'bot-list'}>
                    <Typography>
                        Bot List
                    </Typography>
                    <Box>
                        <Box className={'card-bot'}>
                            <Typography className={'title-bot'}>USD/EUR</Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>

        </Box>
      </>
  )
}
export default AiTrading