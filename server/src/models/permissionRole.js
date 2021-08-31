/* Mongoose */
import { model, Schema } from 'mongoose'

/* PermissionRole Schema */
const PermissionRolesSchema = new Schema({
    name: {
        /* Use a generic name and translate in front */
        type: String,
        required: true,
        unique: true
    },
    resources: {
        /* Example, Name the resource with the mongoose data name
        User: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        Site: {
        },
        Division: {
        },
        MachinePrototype: {
        },
        Machine: {
        },
        AssignedInspection: {
        },
        AssignedMaintenance: {
        } */
    }
},
{
    timestamps: true
}
)

const PermissionRoles = model('PermissionRole', PermissionRolesSchema)

export default PermissionRoles
