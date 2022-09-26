import React from 'react';
import { Text, Button, Icon, Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import {
    getCurrencyDisplayCode,
    isMobile,
    routes,
    getCurrencyName,
    getCFDAccountDisplay,
    isBot,
    formatMoney,
} from '@deriv/shared';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';

interface Icountry_standpoint {
    is_united_kingdom: string;
    is_isle_of_man: string;
}

interface Igeolocation {
    region: any;
    sequence: number;
}
interface Iserver_info {
    geolocation: Igeolocation;
}
interface Iserver {
    server_info: Iserver_info;
}

type TOptionsAccountprops = RouteComponentProps & {
    currency_icon: string | undefined;
    // account_title?: string;
    loginid_text: string;
    balance?: string;
    account_button?: string;
    currency?: string;
    display_type: string;
    has_balance?: boolean;
    has_reset_balance?: boolean;
    is_disabled?: boolean;
    is_virtual?: boolean;
    title?: string;
    country_standpoint: Icountry_standpoint;
    is_eu?: string;
    market_type?: string;
    server?: Iserver;
    sub_account_type?: string;
    has_error?: string;
    platform?: string;
    is_dark_mode_on?: string;
    shortcode?: string;
    should_show_server_name?: string;
    onClickResetVirtualBalance: () => void;
    selected_loginid?: string;
    redirectAccount: () => void;
    activeAccount?: string;
    onClickDeposit?: () => void;
};

type TCurrentDisplay = {
    country_standpoint: Icountry_standpoint;
    currency?: string;
    loginid: string;
    is_virtual?: boolean;
};

type TAccountDisplay = {
    is_eu?: string;
    market_type?: string;
    server?: Iserver;
    sub_account_type?: string;
    has_error?: string;
    platform?: string;
    is_dark_mode_on?: string;
    shortcode?: string;
    should_show_server_name?: string;
};

const OptionsAccount = ({
    currency_icon,
    //account_title,
    loginid_text,
    balance,
    currency,
    display_type,
    has_balance,
    has_reset_balance,
    is_disabled,
    is_virtual,
    country_standpoint,
    is_eu,
    market_type,
    server,
    sub_account_type,
    has_error,
    history,
    platform,
    is_dark_mode_on,
    shortcode,
    should_show_server_name,
    onClickResetVirtualBalance,
    selected_loginid,
    redirectAccount,
    activeAccount,
    onClickDeposit,
}: TOptionsAccountprops) => {
    //const history = useHistory();
    // const onClickDeposit = () => {
    //     history.push(routes.cashier_deposit);
    // };
    const currency_badge = currency ? currency_icon : 'IcCurrencyUnknown';
    return (
        <div
            className={`account__container ${
                activeAccount === loginid_text ? 'account__container-active' : 'account__container-disabled'
            }`}
            onClick={redirectAccount}
        >
            <div className='account__container--icon'>
                <Icon
                    icon={is_virtual ? 'IcCurrencyVirtual' : currency_badge}
                    className={'acc-switcher__id-icon'}
                    size={40}
                />
            </div>
            <div className='account__container--account-details-wrapper'>
                <div className='account__container--account-details-wrapper--name-number'>
                    <Text className='account__container--account-details-wrapper--name-number--name' weight='bold'>
                        {display_type === 'currency' ? (
                            <CurrencyDisplay
                                country_standpoint={country_standpoint}
                                currency={currency}
                                loginid={loginid_text}
                                is_virtual={is_virtual}
                            />
                        ) : (
                            <AccountDisplay
                                is_eu={is_eu}
                                market_type={market_type}
                                server={server}
                                sub_account_type={sub_account_type}
                                has_error={has_error}
                                platform={platform}
                                is_dark_mode_on={is_dark_mode_on}
                                shortcode={shortcode}
                                should_show_server_name={should_show_server_name}
                            />
                        )}
                    </Text>
                    <Text className='account__container--account-details-wrapper--name-number--number'>
                        {loginid_text}
                    </Text>
                </div>

                <Text className='account__container--account-details-wrapper--balance'>
                    {balance}
                    {getCurrencyDisplayCode(currency)}
                </Text>
            </div>
            <div className='account__container--account-reset-button-wrapper'>
                {/* <Text className='account__container--account-reset-button--label' onClick={onClickDeposit}>
                    <Localize i18n_default_text={account_button} />
                </Text> */}

                {/* <Button
                    className='account__container--account-reset-button--label'
                    has_effect
                    text={localize('Deposit')}
                    onClick={onClickDeposit}
                /> */}

                {has_reset_balance ? (
                    <Button
                        is_disabled={is_disabled}
                        onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation();
                            onClickResetVirtualBalance();
                        }}
                        className='acc-switcher__reset-account-btn'
                        secondary
                        small
                    >
                        {localize('Reset')}
                    </Button>
                ) : (
                    <Button
                        is_disabled={is_disabled}
                        onClick={onClickDeposit}
                        className='acc-switcher__reset-account-btn'
                        secondary
                        small
                    >
                        {localize('Deposit')}
                    </Button>
                )}
            </div>
            {isMobile() && getCurrencyDisplayCode(currency) !== 'Demo' && (
                <div className='account__container--dropdown'>
                    <WalletIcon icon={'DropDown'} />
                </div>
            )}
        </div>
    );
};

export default OptionsAccount;

const CurrencyDisplay = ({ country_standpoint, currency, loginid, is_virtual }: TCurrentDisplay) => {
    const user_is_from_this_country_list = Object.values(country_standpoint).includes(true);
    const account_type = loginid.replace(/\d/g, '');

    if (user_is_from_this_country_list) {
        if (account_type === 'MLT') {
            return <Localize i18n_default_text='Options' />;
        } else if (account_type === 'MX') {
            if (country_standpoint.is_united_kingdom) {
                return <Localize i18n_default_text='Gaming' />;
            }
            if (country_standpoint.is_isle_of_man) {
                return getCurrencyName(currency);
            }
            return <Localize i18n_default_text='Synthetic' />;
        } else if (account_type === 'MF') {
            return <Localize i18n_default_text='Multipliers' />;
        }
    }

    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }

    if (!currency) {
        return <Localize i18n_default_text='No currency assigned' />;
    }

    return getCurrencyName(currency);
};

const AccountDisplay = ({
    has_error,
    market_type,
    sub_account_type,
    platform,
    server,
    is_dark_mode_on,
    is_eu,
    shortcode,
    should_show_server_name,
}: TAccountDisplay) => {
    // TODO: Remove once account with error has market_type and sub_account_type in details response
    const getServerName = React.useCallback(
        (account: { server_info: { geolocation: { region: any; sequence: number } } }) => {
            if (account) {
                const server_region = account.server_info?.geolocation?.region;
                if (server_region) {
                    return `${server_region} ${
                        account?.server_info?.geolocation?.sequence === 1
                            ? ''
                            : account?.server_info?.geolocation?.sequence
                    }`;
                }
            }
            return '';
        },
        []
    );
    if (has_error)
        return (
            <div>
                <Text color='disabled' size='xs'>
                    <Localize i18n_default_text='Unavailable' />
                </Text>
                {server?.server_info?.geolocation &&
                    should_show_server_name &&
                    market_type === 'synthetic' &&
                    shortcode === 'svg' && (
                        <Text color='less-prominent' size='xxs' className='badge-server badge-server--disabled'>
                            {getServerName(server)}
                        </Text>
                    )}
            </div>
        );
    return (
        <div>
            {getCFDAccountDisplay({ market_type, sub_account_type, platform, is_eu, shortcode })}
            {server?.server_info?.geolocation &&
                should_show_server_name &&
                market_type === 'synthetic' &&
                shortcode === 'svg' && (
                    <Text
                        color={is_dark_mode_on ? 'general' : 'colored-background'}
                        size='xxs'
                        className={classNames('badge-server', {
                            'badge-server-bot': isBot(),
                        })}
                    >
                        {getServerName(server)}
                    </Text>
                )}
        </div>
    );
};
