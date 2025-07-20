import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-6 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            {t('navigation.settings')}
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Customize your experience with Web Tools Platform.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Choose your preferred theme and display options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Theme settings are coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Select your preferred language for the interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Language settings are available in the header.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                All processing happens locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your data never leaves your device, ensuring complete privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 