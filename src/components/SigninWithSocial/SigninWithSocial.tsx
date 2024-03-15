import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { ReactComponent as GoogleLogo } from '../../assets/icons/logo_google_icon.svg';
import { ReactComponent as FacebookLogo } from '../../assets/icons/logo_facebook_icon.svg';


interface ITypeLogin {
    typeLogin: 'GOOGLE' | 'FACEBOOK'
    tab: 'SIGN_UP' | 'SIGN_IN'
}
const SigninWithSocial = ({typeLogin, tab}: ITypeLogin ) => {

    return (
        <Box
            width='100%'
            sx={{
                backgroundColor: '#e5e7eb',
                borderRadius: 1,
            }}
            mt={2}
        >
            <MuiLink
                sx={{
                    backgroundColor: '#f5f6f7',
                    borderRadius: 1,
                    py: '0.6rem',
                    columnGap: '1rem',
                    textDecoration: 'none',
                    color: '#393e45',
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 13px 0 rgb(0 0 0 / 15%)',
                    },
                }}
                display='flex'
                justifyContent='center'
                alignItems='center'
            >
                {typeLogin === 'GOOGLE' ?
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <GoogleLogo style={{height: '2rem', width: '2rem'}}/>
                        <div style={{color: '#333333', textTransform: 'uppercase', fontWeight: 600}}>{tab === 'SIGN_UP' ? 'Sign up with Google' : 'Sign in with Google'}</div>
                    </Box>
                    :
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <FacebookLogo style={{height: '2rem', width: '2rem'}}/>
                        <div style={{color: '#333333', textTransform: 'uppercase', fontWeight: 600}}>{tab === 'SIGN_UP' ? 'Sign up with Facebook' : 'Sign in with Facebook'}</div>

                    </Box>
                }
            </MuiLink>
        </Box>
    );
};

export default SigninWithSocial;

