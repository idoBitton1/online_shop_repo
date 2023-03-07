import aws from "aws-sdk"

interface Aws {
    s3: aws.S3,
    bucket_name: string,
    signed_url_expire_seconds: number
}

const initial_state: Aws = {
    bucket_name: 'shop-me-online-bucket',
    signed_url_expire_seconds: 60 * 1,
    s3: new aws.S3({
        accessKeyId: "AKIA3ITGV5R5ECFNWZVX",
        signatureVersion: 'v4',
        region: 'eu-central-1',
        secretAccessKey: "0Nlr46D+dnzaCYuthvF0bPCxHajEhbQ7CTXLmTgO"
    })
};

const reducer = (state: Aws = initial_state, action: any) => {
    switch(action.type) {
        default:
            return state;
    }
}

export default reducer;