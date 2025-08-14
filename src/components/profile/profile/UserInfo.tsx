
import './UserInfo.css'
import { useAppSelector } from '@/hooks/rtk';
import type { User } from '@/types/auth';

const UserInfo = () => {
    const user: User = useAppSelector(state => state.auth?.user)

    return <>
        <div className="PageSectionTitle">
            <div className="PageSectionTitle-Content">
                <p
                    className="m-text m-fs18 m-fw600 m-lh140"
                    style={{ color: "var(--color-light-grey-5)" }}
                >
                    <div>Profile info</div>
                </p>
                <div className="PageSectionTitle-Text">
                    <p className="m-text Body-Regular-S">
                        <div>To edit the data, please contact support</div>
                    </p>
                </div>
            </div>
        </div>

        <div className="general-user-page__user-fields items-grid items-grid--cols3 grid__column-gap--16">
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--m username-form-input m-input--disabled"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            type="text"
                            className="username-form-input m-input--disabled"
                            autoComplete="nickname"
                            placeholder={('Username')}
                            value={user.username}
                        />
                        <div className="m-input-content-label"><div>Username</div></div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            autoComplete="given-name"
                            type="text"
                            placeholder={('First name')}
                            value={user.first_name}
                        />
                        <div className="m-input-content-label"><div>First name</div></div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="last_name"
                            disabled
                            autoComplete="family-name"
                            type="text"
                            placeholder={('Last name')}
                            value={user.last_name}
                        />
                        <div className="m-input-content-label"><div>Last name</div></div>
                    </div>
                </div>
            </div>
            <div
                className="m-form-field profile-phone-field"
            >
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            type="tel"
                            autoComplete="tel-national"
                            placeholder={('Phone number')}
                            value={user.phone}
                        />
                        <div className="m-input-content-label"><div>Phone number</div></div>
                    </div>
                </div>
            </div>
            <div
                className="m-form-field profile-email-field"
            >
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            inputMode="email"
                            autoComplete="username"
                            type="text"
                            placeholder={('Email')}
                            value={user.email}
                        />
                        <div className="m-input-content-label"><div>Email</div></div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            type="text"
                            placeholder="DD-MM-YYYY"
                            value={user.date_of_birth}
                        />
                        <div className="m-input-content-label">
                            <div>Date of Birth</div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="gender-select-wrapper gender-select-wrapper--default"
            >
                <div className="m-form-field gender-field">
                    <div
                        className="m-dropdown m-select"
                    >
                        <div className="m-dropdown-activator">
                            <div
                                className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m has-value"

                            >
                                <div className="m-input-content">
                                    <input
                                        disabled-without-style="true"
                                        disabled
                                        className="has-value"
                                        type="text"
                                        placeholder={('Gender')}
                                        value={user.gender}
                                    />
                                    <div className="m-input-content-label"><div>Gender</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="m-form-field CountrySelect"
            >
                <div
                    className="m-dropdown m-select"
                >
                    <div className="m-dropdown-activator">
                        <div
                            className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m filterable has-value"
                        >
                            <div className="m-input-content">
                                <input
                                    disabled-without-style="true"
                                    disabled
                                    className="filterable has-value"
                                    type="text"
                                    placeholder={('Country')}
                                    value={user.country}
                                />
                                <div className="m-input-content-label"><div>Country</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            autoComplete="address-level2"
                            type="text"
                            placeholder={('City')}
                            value={user.city}
                        />
                        <div className="m-input-content-label"><div>City</div></div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            autoComplete="address-level2"
                            type="text"
                            placeholder={('Address')}
                            value={user.address}
                        />
                        <div className="m-input-content-label"><div>Address</div></div>
                    </div>
                </div>
            </div>
            <div className="m-form-field">
                <div
                    className="m-input m-gradient-border m-input--dark m-input--disabled m-input--m"
                >
                    <div className="m-input-content">
                        <input
                            data-qa="input"
                            disabled
                            autoComplete="postal-code"
                            type="text"
                            placeholder={('Postal Code')}
                            value={user.zip_code}
                        />
                        <div className="m-input-content-label"><div>Postal Code</div></div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default UserInfo