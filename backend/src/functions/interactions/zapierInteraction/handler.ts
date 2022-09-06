import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import Interaction from "@models/interaction.model";
import { addInteraction } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";
import { getUserByEmail } from "@repositories/userRepository";
import { getPropertyByErf } from "@repositories/propertyRepository";

const subjectModify =(subject)=>{
    const subjectArrray = subject.split(',');
    const erfArray = subjectArrray[0].split(":")
    const title = subjectArrray[1].trim()
    const erf = erfArray[1].trim()

    return {title, erf}
}

const zapierInteractionHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
    async (event) => {
        try {
            const { body } = event;
           const {title, erf} = subjectModify(body.subject)
           const user = await getUserByEmail(body.userEmail)
           const property = await getPropertyByErf(erf)
           
           if(property.Items.length===0){
            throw new Error(`Property with erf: ${erf} does not exist`)
        }if(user.Items.length===0){
            throw new Error(`User with email ${body.userEmail} not exist`)
        }
            const interaction ={
                type: body.type,
                notes: body.notes,
                title: title,
                propertyId : property.Items[0].id,
                userId: user.Items[0].id
            }

            const data = await addInteraction(interaction as unknown as Interaction);
            return ResponseModel.created(data, "Interaction created");
        } catch (e) {
            return errorResponse(e);
        }
    };
export const main = middyfy(zapierInteractionHandler);
