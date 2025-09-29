import { Trans } from "@lingui/react/macro";
import { useAppSelector } from "@/hooks/rtk.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export default function UserInfo() {

    const user = useAppSelector((s) => s.auth?.user);
    
    return (
        <div className={'bg-white '}>
            <div
                className="p-4 sm:p-6 container mx-auto lg:p-8 space-y-8  text-foreground min-h-screen font-sans">
                {/* Title and description section */}
                <div className="flex flex-col space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-primary">
                        <Trans>Profile Info</Trans>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        <Trans>To edit the data, please contact support.</Trans>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Username */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="username"><Trans>Username</Trans></Label>
                        <Input id="username" value={user.username} disabled/>
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="firstName"><Trans>First Name</Trans></Label>
                        <Input id="firstName" value={user.first_name} disabled/>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="lastName"><Trans>Last Name</Trans></Label>
                        <Input id="lastName" value={user.last_name} disabled/>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="phone"><Trans>Phone Number</Trans></Label>
                        <Input id="phone" type="tel" value={user.phone} disabled/>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="email"><Trans>Email</Trans></Label>
                        <Input id="email" type="email" value={user.email} disabled/>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="dob"><Trans>Date of Birth</Trans></Label>
                        <Input id="dob" value={user.date_of_birth} disabled/>
                    </div>

                    {/* Gender Select */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="gender"><Trans>Gender</Trans></Label>
                        <Select value={user.gender} disabled >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male"><Trans>Male</Trans></SelectItem>
                                <SelectItem value="Female"><Trans>Female</Trans></SelectItem>
                                <SelectItem value="Non-binary"><Trans>Non-binary</Trans></SelectItem>
                                <SelectItem value="Prefer not to say"><Trans>Prefer not to say</Trans></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Country Select */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="country"><Trans>Country</Trans></Label>
                        <Select value={user.country} disabled>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select country"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="United States"><Trans>United States</Trans></SelectItem>
                                <SelectItem value="Canada"><Trans>Canada</Trans></SelectItem>
                                <SelectItem value="Mexico"><Trans>Mexico</Trans></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="city"><Trans>City</Trans></Label>
                        <Input id="city" value={user.city} disabled/>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="address"><Trans>Address</Trans></Label>
                        <Input id="address" value={user.address} disabled/>
                    </div>

                    {/* Postal Code */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="zipCode"><Trans>Postal Code</Trans></Label>
                        <Input id="zipCode" value={user.zip_code} disabled/>
                    </div>
                </div>
            </div>
        </div>

    );
}
