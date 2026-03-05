import React from "react";
import {
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Download,
  MoreVertical,
  ExternalLink,
  Building,
  Users,
  Briefcase,
  DollarSign,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Prospect {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  profileImageUrl?: string;
  city?: string;
  country?: string;
  jobLevel?: string;
  jobFunction?: string;
  industry?: string;
  companySize?: string;
  revenue?: string;
  yearsAtCompany?: number;
  intentSignal?: string;
  engagementScore?: number;
}

interface QuickViewPanelProps {
  prospect: Prospect;
  onExport?: () => void;
  onTag?: () => void;
  onMoreOptions?: () => void;
  maskEmail?: (email: string) => string;
}

const defaultMaskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;
  return localPart.substring(0, 2) + "***@" + domain;
};

interface ContactItemProps {
  value: string | React.ReactNode;
  label?: string;
  isLink?: boolean;
  href?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({
  value,
  label,
  isLink,
  href,
}) => {
  return (
    <div className="mb-2 last:mb-0">
      {isLink && href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium break-all hover:underline"
        >
          {value} {label && <span className="text-gray-600 font-normal">({label})</span>}
        </a>
      ) : (
        <p className="text-sm text-gray-900">
          {value} {label && <span className="text-gray-600 ml-1">({label})</span>}
        </p>
      )}
    </div>
  );
};

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, icon }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </div>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export const QuickViewPanel: React.FC<QuickViewPanelProps> = ({
  prospect,
  onExport,
  onTag,
  onMoreOptions,
  maskEmail = defaultMaskEmail,
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Quick View</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={onMoreOptions}
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Button>
        </div>

        {/* Prospect Header */}
        <div className="px-4 py-3 border-t">
          <div className="flex gap-3 mb-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={prospect.profileImageUrl}
                alt={prospect.fullName}
              />
              <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                {prospect.firstName[0]}
                {prospect.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                {prospect.fullName}
              </h3>
              <p className="text-xs text-gray-600">
                {prospect.jobTitle}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {prospect.companyName}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
              onClick={onExport}
            >
              <Download className="w-3 h-3 mr-1.5" />
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs"
              onClick={onTag}
            >
              Tag
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-7 h-7 p-0 flex-shrink-0"
              onClick={onMoreOptions}
            >
              <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Contact Information Card - Combined */}
        <Card title="Contact Information" icon={<Mail className="w-4 h-4" />}>
          <div className="space-y-4">
            {/* Main Contact Details Section */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase mb-2 pb-2 border-b border-gray-200">
                Main Contact Details
              </h4>
              <div className="space-y-2">
                <ContactItem
                  value={maskEmail(prospect.email)}
                  label="B"
                  isLink={true}
                  href={`mailto:${prospect.email}`}
                />
                {prospect.phone && (
                  <ContactItem
                    value={prospect.phone}
                    label="M"
                  />
                )}
                {prospect.linkedinUrl && (
                  <ContactItem
                    value="LinkedIn Profile"
                    isLink={true}
                    href={prospect.linkedinUrl}
                  />
                )}
              </div>
            </div>

            {/* Additional Contact Details Section */}
            {prospect.phone && (
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase mb-2 pb-2 border-b border-gray-200">
                  Additional Contact Details
                </h4>
                <div className="space-y-2">
                  <ContactItem
                    value={prospect.phone}
                    label="HQ"
                  />
                </div>
              </div>
            )}

            {/* Location Section */}
            {prospect.city && prospect.country && (
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase mb-2 pb-2 border-b border-gray-200">
                  Location
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">
                    Local: {prospect.city}, {prospect.country}
                  </p>
                </div>
              </div>
            )}

            {/* CRM Section */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase mb-2 pb-2 border-b border-gray-200">
                CRM
              </h4>
              <div className="text-sm text-gray-600">
                No CRM contact or account owner
              </div>
            </div>
          </div>
        </Card>

        {/* Company Details Card */}
        <Card title="Company Details" icon={<Building className="w-4 h-4" />}>
          <div className="space-y-4">
            {/* Company Name with Logo */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <a
                  href="#"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {prospect.companyName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                Description
              </p>
              <p className="text-sm text-gray-700">
                {prospect.companyName} is a leading company in their industry, providing innovative solutions.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                Show More
              </button>
            </div>

            {/* HQ Location */}
            {prospect.city && prospect.country && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  HQ Location
                </p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700">
                    {prospect.city}, {prospect.country}
                  </p>
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                </div>
              </div>
            )}

            {/* Employees */}
            {prospect.companySize && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Employees
                </p>
                <p className="text-sm text-gray-900">{prospect.companySize}</p>
              </div>
            )}

            {/* Revenue */}
            {prospect.revenue && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Revenue
                </p>
                <p className="text-sm text-gray-900">{prospect.revenue}</p>
              </div>
            )}

            {/* Industry */}
            {prospect.industry && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Industry
                </p>
                <p className="text-sm text-gray-700 mb-1">{prospect.industry}</p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all
                </button>
              </div>
            )}

            {/* Job Function */}
            {prospect.jobFunction && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Function</p>
                <p className="text-sm text-gray-900">{prospect.jobFunction}</p>
              </div>
            )}

            {/* Phone */}
            {prospect.phone && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  HQ Phone
                </p>
                <a
                  href={`tel:${prospect.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {prospect.phone} <span className="text-gray-600 font-normal">(HQ)</span>
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Job Level Card */}
        {prospect.jobLevel && (
          <Card title="Job Level">
            <p className="text-sm text-gray-900">{prospect.jobLevel}</p>
          </Card>
        )}
      </div>
    </div>
  );
};
