// Type definitions for the Trello PowerUp Client v1.20.9
// Definitions by: Angelo Tata https://github.com/tatablack/

declare global {
    interface Window {
        TrelloPowerUp: Trello.PowerUp;
        locale: string;
    }
}

export namespace Trello {
    namespace Callback {
        type CacheAction = 'run' | 'retain' | 'release';
        type SerializeResult = (value: any, key?: string) => any

        type SerializeOutput = {
            _callback: string;
        }

        interface CacheOptions {
            action: CacheAction;
            options: any;
            callback: string;
        }

        interface Cache {
            callback(t: PowerUp.IFrame, options: CacheOptions, serializeResult: SerializeResult): Promise<any>;
            serialize(fx: (t: PowerUp.IFrame, args: any) => any): SerializeOutput;
            reset(): void;
        }
    }

    interface PowerUp {
        version: string;
        Promise: Promise<any>;
        CallbackCache: Callback.Cache;
        PostMessageIO: any; // PostMessageIO
        iframe(options?: PowerUp.IFrameOptions): PowerUp.IFrame;
        initialize(handlers: PowerUp.CapabilityHandlers, options?: PowerUp.PluginOptions): PowerUp.Plugin | PowerUp.IFrame;
        restApiError(): any;
        util: PowerUp.Util;
    }

    namespace PowerUp {
        // INTERNAL TYPES
        type ResourceDictionary = {
            [key: string]: string;
        }

        type OrganizationFields = keyof Organization;
        type BoardFields = keyof Board;
        type CardFields = keyof Card;
        type ListFields = keyof List;
        type MemberFields = keyof Member;

        // USER-FACING TYPES

        type CapabilityHandlers = {
            'attachment-sections'?: (t: PowerUp.IFrame, options: {
                entries: Attachment[];
            }) => Promise<(AttachmentSection | LazyAttachmentSection)[]>;
            'attachment-thumbnail'?: () => void;
            'board-buttons'?: (t: PowerUp.IFrame) => Promise<(BoardButtonUrl | BoardButtonCallback)[]>;
            'card-back-section'?: (t: PowerUp.IFrame) => Promise<CardBackSection>;
            'card-badges'?: (t: PowerUp.IFrame) => Promise<(CardBadgeDynamic | CardBadge)[]>;
            'card-buttons'?: (t: PowerUp.IFrame) => Promise<CardButton[]>;
            'card-detail-badges'?: (t: PowerUp.IFrame) => Promise<(CardDetailBadgeDynamic | CardDetailBadge)[]>;
            'card-from-url'?: () => void;
            'format-url'?: () => void;
            'list-actions'?: (t: PowerUp.IFrame) => Promise<ListAction[]>;
            'list-sorters'?: (t: PowerUp.IFrame) => Promise<ListSorter[]>;
            'on-enable'?: (t: PowerUp.IFrame) => Promise<void>;
            'on-disable'?: () => void;
            'remove-data'?: () => void;
            'show-settings'?: (t: PowerUp.IFrame) => Promise<void>;
            'authorization-status'?: () => void;
            'show-authorization'?: () => void;
        };

        type Condition = 'admin' | 'always' | 'edit' | 'readonly' | 'signedIn' | 'signedOut';

        type Model = 'board' | 'card' | 'organization';
        type Scope = Model | 'member';
        type Permissions = 'read' | 'write';

        type Visibility = 'shared' | 'private';

        interface PopupOptionsItem {
            text: string;
            callback?(t: any, options: any): Promise<void>;
        }

        interface PopupOptions {
            title: string;
            items: PopupOptionsItem[];
        }

        interface PopupSearchOptions extends PopupOptions {
            search: {
                count?: number;
                placeholder?: string;
                empty?: string;
                searching?: string;
                debounce?: number;
            };
        }

        interface PopupIframeOptions {
            title: string;
            url: string;
            args?: {
                [key: string]: any;
            };
            height?: number;
        }

        interface PopupDateOptions {
            type: 'date' | 'datetime';
            title: string;
            callback(t: PowerUp.IFrame, options: {
                date: string;
            }): Promise<void>;
            date?: Date;
            minDate?: Date;
            maxDate?: Date;
        }

        interface PopupConfirmOptions {
            type: 'confirm';
            title: string;
            message: string;
            confirmText: string;
            onConfirm(t: PowerUp.IFrame, opts: any): Promise<void>;
            confirmStyle?: 'primary' | 'danger';
        }

        interface PopupConfirmWithCancelOptions extends PopupConfirmOptions {
            cancelText: string;
            onCancel(t: PowerUp.IFrame, opts: any): Promise<void>;
        }

        interface HeaderAction {
            icon: string;
            alt: string;
            callback(): void;
            position: 'left' | 'right';
            url?: string;
        }

        type Colors = 'blue' | 'green' | 'orange' | 'red' | 'yellow' |
            'purple' | 'pink' | 'sky' | 'lime' | 'light-gray' | 'business-blue';

        type AlertDisplay = 'info' | 'warning' | 'error' | 'success';

        // INTERNAL INTERFACES
        interface Localizer {
            resourceDictionary: ResourceDictionary;
            localize(key: string, args: readonly string[]): string;
        }

        interface Localization {
            defaultLocale: string;
            supportedLocales: string[];
            resourceUrl: string;
        }

        interface LocalizerOptions {
            localizer?: Localizer;
            loadLocalizer?(): Promise<Localizer>;
            localization?: Localization;
        }

        interface Util {
            color: {
                getHexString(): string;
                namedColorStringToHex(): string;
            };

            convert: {
                bytesToHexString(): string;
                hexStringToUint8Array(): any;
            };

            crypto: {
                decryptSecret(): any;
                encryptSecret(): any;
                exportAESCBCKeyToRaw(): any;
                generateAESCBCKey(): any;
                generateInitVector(): any;
                importAESCBCKeyFromRaw(): any;
                sha256Digest(): any;
            };

            initLocalizer(locale: string, options: LocalizerOptions): Promise<void>;
            makeErrorEnum(): Error;
            relativeUrl(url: string): string;
        }

        interface AnonymousHostHandlers {
            requestWithContext(command: string, options: any): Promise<any>;
            getAll(): Promise<any>;
            get(scope: Scope | string, visibility: Visibility, key?: string, defaultValue?: any): Promise<any>;
            set(scope: Scope | string, visibility: Visibility, key: string, defaultValue?: any): Promise<void>;
            set(scope: Scope | string, visibility: Visibility, entries: {
                [ key: string]: any;
            }): Promise<void>;
            remove(scope: Scope | string, visibility: Visibility, key: string): Promise<void>;
            remove(scope: Scope | string, visibility: Visibility, entries: string[]): Promise<void>;
            safe(html: string): string;
            localizeKey(key: string, data?: {
                [key: string]: string;
            }): string;
            localizeKeys(keys: [string | string[]]): string[];
            localizeNode(node: Element): void;
            board(...fields: ['all'] | BoardFields[]): Promise<Board>;
            cards(...fields: ['all'] | CardFields[]): Promise<Card[]>;
            lists(...fields: ['all'] | ListFields[]): Promise<List[]>;
            member(...fields: ['all'] | MemberFields[]): Promise<Member>;
            organization(...fields: ['all'] | OrganizationFields[]): Promise<Organization>;
        }

        interface HostHandlers extends AnonymousHostHandlers {
            getContext(): Context;
            isMemberSignedIn(): boolean;
            memberCanWriteToModel(modelType: Model): boolean;
            arg(name: string, defaultValue?: any): any;
            signUrl(url: string, args?: { [key: string]: any}): string;
            navigate(options: { url: string }): any;
            showCard(idCard: string): Promise<void>;
            hideCard(): Promise<void>;
            alert(options: {
                message: string;
                duration?: number;
                display?: AlertDisplay;
            }): Promise<void>;
            hideAlert(): Promise<void>;
            popup(
                options: PopupOptions | PopupSearchOptions |
                    PopupIframeOptions | PopupDateOptions |
                    PopupConfirmOptions | PopupConfirmWithCancelOptions): Promise<void>;
            overlay(options: {
                url: string;
                args: { [key: string]: any};
                inset: unknown;
            }): Promise<void>;
            boardBar(options: {
                url: string;
                args?: { [key: string]: any};
                height?: number;
                accentColor?: string | Colors;
                callback?(t: PowerUp.IFrame): void;
                title?: string;
                actions?: HeaderAction[];
                resizable?: boolean;
            }): Promise<void>;
            modal(options: {
                url: string;
                accentColor?: string | Colors;
                height?: number;
                fullscreen?: boolean;
                callback?(): void;
                title?: string;
                actions?: HeaderAction[];
                args?: { [key: string]: any};
            }): Promise<void>;
            updateModal(options: {
                accentColor?: string | Colors;
                actions?: HeaderAction[];
                fullscreen?: boolean;
                title?: string;
            }): Promise<void>;
            closePopup(): Promise<void>;
            back(): Promise<void>;
            hideOverlay(): Promise<void>;
            closeOverlay(options?: {
                inset?: unknown;
            }): Promise<void>;
            hideBoardBar(): Promise<void>;
            closeBoardBar(): Promise<void>;
            closeModal(): Promise<void>;
            sizeTo(arg: string | number | Element): Promise<void>;
            card(...fields: ['all'] | CardFields[]): Promise<Card>;
            list(...fields: ['all'] | ListFields[]): Promise<List>;
            attach(data: {
                name: string;
                url: string;
            }): Promise<void>;
            requestToken(options: unknown): Promise<string>;
            authorize(authUrl: string, options?: {
                height?: number;
                width?: number;
                validToken?(value: string): boolean;
            }): Promise<string>;
            storeSecret(secretKey: string, secretData: string): Promise<void>;
            loadSecret(secretKey: string): Promise<string>;
            clearSecret(secretKey: string): Promise<void>;
            notifyParent(message: string, options?: {
                targetOrigin: string;
            }): Promise<void>;
        }

        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface IFrameOptions extends LocalizerOptions {
            context?: string;
            secret?: string;
            helpfulStacks?: boolean;
        }

        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface IFrame extends HostHandlers {
            io: any | null;
            args: any[];
            secret?: string;
            options: IFrameOptions;
            i18nPromise: Promise<void>;
            init(): any;
            connect(): void;
            request(command: string, options: any): Promise<any>;
            render(fxRender: () => void): any;
            initApi(): void;
            getRestApi(): unknown;
            initSentry(): void;
        }

        interface PluginOptions extends LocalizerOptions {
            Sentry?: {
                configureScope(callback: (scope: {
                    setTags(name: string, value: string): void;
                    setUser(value: {
                        id: string;
                    }): void;
                }) => void): void;
            };
            appKey?: string;
            appName?: string;
            apiOrigin?: string;
            authOrigin?: string;
            localStorage?: Storage;
            tokenStorageKey?: string;
            helpfulStacks?: boolean;
        }

        interface Plugin extends AnonymousHostHandlers {
            options: PluginOptions;
            connect(): any; // return an instance of PostMessageIO
            request(command: string, options: any): Promise<any>; //  // return PostMessageIO.request, whatever that is
            init(): any; // return an instance of PostMessageIO
            NotHandled(): any; // return PostMessageIO.NotHandled, whatever that is
        }

        // USER-FACING INTERFACES
        interface BoardButtonBase {
            icon: string | {
                dark: string;
                light: string;
            };
            text: string;
            condition?: Condition;
        }

        interface BoardButtonCallback extends BoardButtonBase {
            callback: (t: Trello.PowerUp.IFrame) => Promise<void>;
        }

        interface BoardButtonUrl extends BoardButtonBase {
            url: string;
            target?: string;
        }

        interface CardBackSection {
            title: string;
            icon: string;
            content: {
                type: 'iframe';
                url: string;
                height?: number;
            };
        }

        interface CardBadge {
            text?: string;
            icon?: string;
            color?: Colors;
            refresh?: number;
        }

        interface CardBadgeDynamic {
            dynamic(): CardBadge;
        }

        interface CardDetailBadge extends CardBadge {
            title: string;
            callback?(t: PowerUp.IFrame): void;
            url?: string;
            target?: string;
        }

        interface CardDetailBadgeDynamic {
            dynamic(): CardDetailBadge;
        }

        interface ListAction {
            text: string;
            callback(t: PowerUp.IFrame): Promise<void>;
        }

        interface ListSorter {
            text: string;
            callback(t: PowerUp.IFrame, options: {
                cards: Card[];
            }): Promise<{ sortedIds: string[]}>;
        }

        interface CardButton {
            icon: string;
            text: string;
            condition?: Condition;
            callback(t: Trello.PowerUp.IFrame): Promise<void>;
            url?: string;
            target?: string;
        }

        interface AttachmentsByType {
            [key: string]: {
                board: number;
                card: number;
            };
        }

        interface Preview {
            bytes: number;
            height: number;
            scaled: boolean;
            url: string;
            width: number;
        }

        interface AttachmentSectionBase {
            claimed: boolean;
            icon: string;
            content: {
                type: string;
                url: string;
                height?: number;
            };
        }

        interface AttachmentSection extends AttachmentSectionBase {
            title: string;
        }

        interface LazyAttachmentSection extends AttachmentSectionBase {
            id: string;
            title(): string;
        }

        interface Attachment {
            date: string;
            edgeColor: string;
            id: string;
            idMember: string;
            name: string;
            previews: Preview[];
            url: string;
        }

        interface BadgesInfo {
            attachments: number;
            attachmentsByType: AttachmentsByType;
            checkItems: number;
            checkItemsChecked: number;
            comments: number;
            description: boolean;
            due: string; // timestamp
            dueComplete: boolean;
            fogbugz: string;
            location: boolean;
            subscribed: boolean;
            viewingMemberVoted: boolean;
            votes: number;
        }

        interface Coordinates {
            latitude: number;
            longitude: number;
        }

        interface Label {
            id: string;
            name: string;
            color: Colors;
        }

        interface CustomField {
            id: string;
            idCustomField: string;
            idValue?: string;
            value?: CustomFieldValue;
        }

        interface CustomFieldValue {
            checked?: string;
            date?: string;
            text?: string;
            number?: string;
        }

        type MemberType = 'admin' | 'normal' | 'observer'

        interface Membership {
            deactivated: boolean;
            id: string;
            idMember: string;
            memberType: MemberType;
            unconfirmed: boolean;
        }

        interface Organization {
            id: string;
            name: string;
        }

        interface Board {
            id: string;
            name: string;
            url: string; // https://trello.com/c/I5nAdteE/9-test
            shortLink: string;
            members: Member[];
            dateLastActivity: string; // "2019-11-28T15:53:19.709Z"
            idOrganization: string;
            customFields: CustomField[];
            labels: Label[];
            memberships: Membership[];
        }

        interface Card {
            address: string | null;
            attachments: Attachment[];
            badges: BadgesInfo;
            closed: boolean;
            coordinates: Coordinates | null;
            cover: Attachment | null;
            customFieldItems: CustomField[];
            dateLastActivity: string; // "2019-11-28T15:53:19.709Z"
            desc: string;
            due: string | null; // "2019-11-28T15:53:19.709Z"
            dueComplete: boolean;
            id: string;
            idList: string;
            idShort: number;
            labels: Label[];
            locationName: string | null;
            members: Member[];
            name: string;
            pos: number;
            shortLink: string;
            url: string; // https://trello.com/c/I5nAdteE/9-test
        }

        interface List {
            id: string;
            name: string;
            cards: Card[];
        }

        interface Member {
            id: string;
            fullName: string | null;
            username: string | null;
            initials: string | null;
            avatar: string | null;
        }

        interface Context {
            board: string;
            card?: string;
            command?: string;
            member: string;
            organization?: string;
            enterprise?: string;
            permissions?: {
                board: Permissions;
                card: Permissions;
                organization: Permissions;
            };
            version: string;
        }
    }
}
