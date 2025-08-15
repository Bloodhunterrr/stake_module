import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface User {
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    country: string;
    city: string;
    address: string;
    zip_code: string;
}

const mockUser: User = {
    username: 'johndoe',
    first_name: 'John',
    last_name: 'Doe',
    phone: '555-123-4567',
    email: 'john.doe@example.com',
    date_of_birth: '01-01-1990',
    gender: 'Male',
    country: 'United States',
    city: 'New York',
    address: '123 Main St',
    zip_code: '10001',
};

export default function UserInfo() {
    const user = mockUser;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background text-foreground min-h-screen font-sans">
            {/* Title and description section */}
            <div className="flex flex-col space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-primary">
                    Profile Info
                </h1>
                <p className="text-sm text-muted-foreground">
                    To edit the data, please contact support.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Username */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user.username} disabled />
                </div>

                {/* First Name */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={user.first_name} disabled />
                </div>

                {/* Last Name */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={user.last_name} disabled />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={user.phone} disabled />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} disabled />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" value={user.date_of_birth} disabled />
                </div>

                {/* Gender Select */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={user.gender} disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Country Select */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={user.country} disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* City */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={user.city} disabled />
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={user.address} disabled />
                </div>

                {/* Postal Code */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input id="zipCode" value={user.zip_code} disabled />
                </div>
            </div>
        </div>
    );
}
