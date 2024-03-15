import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import front_side_id from "../../../assets/images/profile/id_card.png";
import back_side_id from "../../../assets/images/profile/back_side.png";
import selfie_id from "../../../assets/images/profile/selfie_id.png";
import './Kyc.scss'
import {useEffect, useState} from "react";
import {upload} from "../../../apis/SystemParams";
import {getDataKyc, kyc} from "../../../apis/UserApi";
import {snackActions} from "../../../utils/showSnackBar";
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const Kyc = () => {
    const [numberId, setNumberId] = useState('')
    const [selectedFile, setSelectedFile] = useState({
        frontSide: '',
        backSide: '',
        selfie: ''
    });
    const [error, setError] = useState({
        frontSide: '',
        backSide: '',
        selfie: ''
    });
    const [listImageUrl, setListImageUrl] = useState({
        frontSide: '',
        backSide: '',
        selfie: ''
    });
    const [kycStatus, setKycStatus] = useState('NOT_YET')
    const [isDisabledKyc, setIsDisabledKyc] = useState(false)

    // useEffect(() => {
    //     console.log(selectedFile)
    //     console.log(listImageUrl)
    // }, [selectedFile]);

    const handleFileFrontSideChange = (event: any) => {
        handleFileValidation(event, 'frontSide')
    }

    const handleFileBackSideChange = (event: any) => {
        handleFileValidation(event, 'backSide')
    }
    const handleFileSelfieChange = (event: any) => {
        handleFileValidation(event, 'selfie')
    }
    const handleFileValidation = (event: any, type: string) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        console.log(reader)
        // File type validation
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError({...error, [type]: "Invalid file type. Please upload a JPEG, PNG"})
            return;
        }

        // File size validation
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError({...error, [type]: `File size exceeds ${MAX_FILE_SIZE_MB} MB. Please choose a smaller file.`})
            return;
        }

        console.log(reader.result)
        reader.onloadend = () => {
            console.log(reader.result)
            setListImageUrl({...listImageUrl, [type]: reader.result})
        };
        reader.readAsDataURL(file);

        setSelectedFile((file) => ({...file, [type]: event.target.files[0]}))
        setError((error) => ({...error,
            [type]: ''
        }))
    };

    const handleChangeInput = (event: any) => {
        setNumberId(event.target.value)
    }

    const handleRemoveImg = (type: string) => {
        if(type === 'FRONT_SIDE'){
            setListImageUrl((image) => ({
                ...image,
                frontSide: ''
            }))
            setSelectedFile((selectedFile) => ({
                ...selectedFile,
                frontSide: ''
            }))
        }else if(type === 'BACK_SIDE'){
            setListImageUrl((image) => ({
                ...image,
                backSide: ''
            }))
            setSelectedFile((selectedFile) => ({
                ...selectedFile,
                backSide: ''
            }))
        }else{
            setListImageUrl((image) => ({
                ...image,
                selfie: ''
            }))
            setSelectedFile((selectedFile) => ({
                ...selectedFile,
                selfie: ''
            }))
        }
    }

    const handleVerifyKyc = async (): Promise<void> => {
        try {
            const listUploadSuccess: Array<string> = []
            if (selectedFile && numberId) {
                for (let [key, value] of Object.entries(selectedFile)) {
                    const formData = new FormData();
                    formData.append("file", value);
                    const rs = await upload(formData)
                    listUploadSuccess.push(rs.data.file)
                }
                console.log(listUploadSuccess)
                const sendKyc = {
                    id_number: numberId,
                    id_front: listUploadSuccess[0],
                    id_back: listUploadSuccess[1],
                    selfie_with_photo: listUploadSuccess[2]
                }
                const rs = await kyc(sendKyc)
                if(rs.code === 'SUCCESS'){
                    snackActions.success('Information you successfully submitted.')
                    await getDataKyc()
                }else{
                    snackActions.error('An error occurred.')

                }
            } else {
                snackActions.error('Please fill in the information.')
            }
        }catch (e) {
            console.log(e)
            snackActions.error('An error occurred.')
        }
    }

    const getKyc = async () => {
        try {
            const rs = await getDataKyc()
            setNumberId(rs.data.id_number)
            if(rs.data.status === 'PENDING' || rs.data.status === 'DONE'){
                setKycStatus(rs.data.status)
                setIsDisabledKyc(true)
                setListImageUrl((image) => (
                    {
                        ...image,
                        frontSide: process.env.REACT_APP_API_URL + rs.data.id_front,
                        backSide: process.env.REACT_APP_API_URL + rs.data.id_back,
                        selfie: process.env.REACT_APP_API_URL + rs.data.selfie_with_photo,
                    }
                ))
            }
        }catch (e) {
            snackActions.error('An error occurred.')
        }
    }

    useEffect(() => {
        getKyc()
    }, []);


    return (
        <>
            <Box className={'kyc'}>
                {/*{kycStatus === 'REJECTED' && (*/}
                {/*    <Box className={'kyc-status reject'}>*/}
                {/*        <ErrorOutlineIcon sx={{color: '#EB5757', marginRight: '1rem'}}/>*/}
                {/*        <div>*/}
                {/*            <Typography className={'title'}>Your verification has been rejected.</Typography>*/}
                {/*            <Typography className={'desc'}>Your previous verification failed. Please follow the tips below before trying again:</Typography>*/}
                {/*            <ul>*/}
                {/*                <li>Submit a <strong>readable</strong> image of your documents, front and back.</li>*/}
                {/*                <li>Make sure the country in the dropdown matches your document country.</li>*/}
                {/*                <li>Only use documents that include <strong>date of birth</strong> and full name.</li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*    </Box>*/}
                {/*)}*/}
                {kycStatus === 'PENDING' && (
                    <Box className={'kyc-status'}>
                        <img src="/images/icons/icon-processing.svg" alt=""/>
                        <div>
                            <Typography className={'title'}>Verification still processing...</Typography>
                            <Typography className={'desc'}>Your ID requires additional verification. We will email you once verification has been completed.</Typography>
                        </div>
                    </Box>
                )}
                {kycStatus === 'DONE' && (
                    <Box className={'kyc-status'}>
                        <img src="/images/icons/icon-verified.svg" alt=""/>
                        <div>
                            <Typography className={'title'}>You are verified!</Typography>
                            <Typography className={'desc'}>You can withdraw, transfer now.</Typography>
                        </div>
                    </Box>
                )}
                <Box className={'kyc-container'}>
                    <Typography variant="h5" mb={3}>ID Verification</Typography>
                    <FormControl sx={{width: '100%'}}>
                        {/*<Box mb={3}>*/}
                        {/*    <FormLabel id="demo-radio-buttons-group-label">ID type</FormLabel>*/}
                        {/*    <RadioGroup*/}
                        {/*        row*/}
                        {/*        aria-labelledby="demo-row-radio-buttons-group-label"*/}
                        {/*        name="row-radio-buttons-group"*/}
                        {/*    >*/}
                        {/*        <FormControlLabel value="female" control={<Radio />} label="ID Card" />*/}
                        {/*        <FormControlLabel value="male" control={<Radio />} label="Passport" />*/}
                        {/*    </RadioGroup>*/}
                        {/*</Box>*/}
                        <Box mb={3} width={'100%'}>
                            <TextField
                                required
                                label="ID number"
                                variant="filled"
                                style={{ width: "100%" }}
                                size="small"
                                className={'custom-input'}
                                value={numberId}
                                onChange={handleChangeInput}
                                disabled={isDisabledKyc}
                            />
                        </Box>
                        <Box>
                            <Typography mb={2}>Upload ID document photo</Typography>
                            <Typography mb={2} fontSize={14} color={'#5B616E'}>** Please make sure that the photos are complete and clearly visible. ID
                                card must be in the valid period.</Typography>

                            <div className={'upload-container'}>
                                <Box sx={{position: 'relative', maxWidth: '100%'}}>
                                    <Button
                                        className={'btn-upload-id'}
                                        component="label"
                                        variant="outlined"
                                    >
                                        <div className={'text-upload'}>
                                            <Typography component="h4">FRONT SIDE</Typography>
                                            <Typography>Click to upload </Typography>
                                            {error.frontSide && (<Typography
                                                sx={{color: '#d32f2f !important'}}>{error.frontSide}</Typography>)}
                                        </div>
                                        <input type="file" hidden
                                               accept="image/*"
                                               onChange={handleFileFrontSideChange} disabled={isDisabledKyc}/>
                                    </Button>
                                    {listImageUrl.frontSide &&
                                        <div className={'preview-img'}>
                                            <img src={listImageUrl.frontSide} alt=""/>
                                            {!isDisabledKyc && (
                                                <Button className={'btn-remove-img'} variant="outlined" size="small"
                                                        startIcon={<CloseIcon/>}
                                                        onClick={() => handleRemoveImg('FRONT_SIDE')}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    }
                                </Box>
                                <Typography fontSize={14} color={'#5B616E'}>Example</Typography>
                                <div className={'example-image'}>
                                    <img src={front_side_id} alt="" width={446} height={320}/>
                                </div>
                            </div>

                            <div className={'upload-container'}>
                                <Box sx={{position: 'relative', maxWidth: '100%'}}>
                                    <Button
                                        className={'btn-upload-id'}
                                        component="label"
                                        variant="outlined"
                                    >
                                        <div className={'text-upload'}>
                                            <Typography component="h4">BACK SIDE</Typography>
                                            <Typography>Click to upload </Typography>
                                            {error.backSide && (<Typography
                                                sx={{color: '#d32f2f !important'}}>{error.backSide}</Typography>)}
                                        </div>
                                        <input type="file" hidden
                                               accept="image/*"
                                               onChange={handleFileBackSideChange}
                                               disabled={isDisabledKyc}
                                        />
                                    </Button>
                                    {listImageUrl.backSide &&
                                        <div className={'preview-img'}>
                                            <img src={listImageUrl.backSide} alt=""/>
                                            {!isDisabledKyc && (
                                                <Button className={'btn-remove-img'} variant="outlined" size="small"
                                                        startIcon={<CloseIcon/>}
                                                        onClick={() => handleRemoveImg('BACK_SIDE')}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    }
                                </Box>
                                <Typography fontSize={14} color={'#5B616E'}>Example</Typography>
                                <div className={'example-image'}>
                                    <img src={back_side_id} alt="" width={446} height={320}/>
                                </div>
                            </div>
                        </Box>
                        <Box>
                        <Typography mb={2}>Selfie with photo ID and note</Typography>
                            <Typography mb={2} fontSize={14} color={'#5B616E'}>** Please provide a photo if you holding your ID card front side. In the same picture, make a reference to Quarax and today’s date displayed.
                                Make sure your face is clearly visible and that all passport details are clearly readable..</Typography>

                            <div className={'upload-container'}>
                                <Box sx={{position: 'relative', maxWidth: '100%'}}>
                                    <Button
                                        className={'btn-upload-id'}
                                        component="label"
                                        variant="outlined"
                                    >
                                        <div className={'text-upload'}>
                                            {/*<Typography component="h4">FRONT SIDE</Typography>*/}
                                            <Typography>Click to upload </Typography>
                                            {error.selfie && (<Typography
                                                sx={{color: '#d32f2f !important'}}>{error.selfie}</Typography>)}
                                        </div>
                                        <input type="file" hidden
                                               accept="image/*"
                                               onChange={handleFileSelfieChange}
                                               disabled={isDisabledKyc}
                                        />
                                    </Button>
                                    {listImageUrl.selfie &&
                                        <div className={'preview-img'}>
                                            <img src={listImageUrl.selfie} alt=""/>
                                            {!isDisabledKyc && (
                                                <Button className={'btn-remove-img'} variant="outlined" size="small"
                                                        startIcon={<CloseIcon/>}
                                                        onClick={() => handleRemoveImg('SELFIE')}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    }
                                </Box>
                                <Typography fontSize={14} color={'#5B616E'}>Example</Typography>
                                <div className={'example-image'}>
                                    <img src={selfie_id} alt="" width={446} height={320}/>
                                </div>
                            </div>
                        </Box>
                        {!isDisabledKyc && (
                            <Box sx={{width: '160px', margin: '0 auto'}}>
                                <Button className={'custom-btn'} onClick={handleVerifyKyc}>Verify</Button>
                            </Box>
                        )}
                    </FormControl>
                </Box>
            </Box>
        </>
    )
}
export default Kyc